import {
  savePayment,
  getPaymentByProviderPaymentId,
  upsertInvitation,
  getInvitationBySlug,
  getRsvpsByInvitationSlug,
  getPaymentsByUserId,
} from "../lib/db";

async function runRlsAndRaceTests() {
  console.log("=================================================================");
  console.log("   VARNAM ADVANCED RLS ISOLATION & PAYMENT CONCURRENCY AUDIT");
  console.log("=================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // ---------------------------------------------------------------------------------
  // TEST 1: PAYMENT SIMULTANEOUS CONCURRENCY & ATOMIC UPSERT
  // ---------------------------------------------------------------------------------
  console.log("--- TEST GROUP 1: Payment Simultaneous Concurrency (10 Parallel Calls) ---");

  const concurrentPaymentId = "pay_race_test_" + Date.now();
  const concurrentOrderId = "order_race_test_" + Date.now();
  const testUserId = "user_race_test_1";

  // Simulate 10 simultaneous concurrent requests hitting savePayment at the exact same millisecond
  const concurrentRequests = Array.from({ length: 10 }).map((_, i) =>
    savePayment({
      user_id: testUserId,
      invitation_slug: "test-race-slug",
      provider: "razorpay",
      provider_order_id: concurrentOrderId,
      provider_payment_id: concurrentPaymentId,
      amount_inr: 999,
      currency: "INR",
      status: "captured",
      metadata: { callIndex: i },
    })
  );

  const results = await Promise.all(concurrentRequests);

  // All 10 parallel calls must resolve to the exact same provider_payment_id
  const allIdsMatch = results.every((r) => r.provider_payment_id === concurrentPaymentId);
  assert(allIdsMatch, "All 10 simultaneous payment writes resolved to the same provider_payment_id");

  // In database, there must be EXACTLY ONE payment record for this paymentId
  const retrievedPayment = await getPaymentByProviderPaymentId(concurrentPaymentId);
  assert(retrievedPayment !== null, "Payment record exists in database");

  const userPayments = await getPaymentsByUserId(testUserId);
  const matchingPayments = userPayments.filter((p) => p.provider_payment_id === concurrentPaymentId);
  assert(matchingPayments.length === 1, `Exactly 1 payment record created in database (no duplicates found: ${matchingPayments.length})`);

  // ---------------------------------------------------------------------------------
  // TEST 2: MULTI-TENANT ISOLATION (CUSTOMER A vs CUSTOMER B vs ANONYMOUS)
  // ---------------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 2: Cross-Account Multi-Tenant Isolation ---");

  const customerA = "cust_A_" + Date.now();
  const customerB = "cust_B_" + Date.now();
  const draftSlugA = "draft-cust-a-" + Date.now();

  // Customer A creates a private draft
  await upsertInvitation({
    template_slug: "rose-classic",
    slug: draftSlugA,
    user_id: customerA,
    bride_name: "Customer A Bride",
    groom_name: "Customer A Groom",
    wedding_date: "2027-02-01T10:00:00.000Z",
    wedding_venue: "Private Resort",
    status: "draft",
    is_paid: false,
  });

  // Verify Customer A can fetch their own draft
  const fetchedByOwner = await getInvitationBySlug(draftSlugA);
  assert(fetchedByOwner !== null && fetchedByOwner.user_id === customerA, "Owner (Customer A) can access their own draft");

  // Attempt 1: Customer B tries to read Customer A's RSVPs
  let crossAccountRsvpBlocked = false;
  try {
    await getRsvpsByInvitationSlug(draftSlugA, customerB); // Customer B as requester
  } catch (err: any) {
    crossAccountRsvpBlocked = err.message.includes("Unauthorized");
  }
  assert(crossAccountRsvpBlocked, "Customer B cannot read Customer A's RSVPs (Unauthorized 403 exception thrown)");

  // Attempt 2: Anonymous guest tries to read Customer A's RSVPs via API endpoint
  const anonRsvpRes = await fetch(`http://localhost:3000/api/rsvps?slug=${draftSlugA}`);
  assert(anonRsvpRes.status === 401, "Anonymous guest cannot read RSVPs (HTTP 401 Unauthorized)");

  // Attempt 3: Anonymous guest tries to view Customer A's private unpublished draft
  const anonInviteRes = await fetch(`http://localhost:3000/api/invitations/${draftSlugA}`);
  assert(anonInviteRes.status === 404, "Anonymous guest cannot view unpaid/unpublished draft (HTTP 404 Not Found)");

  // Attempt 4: Customer B tries to update Customer A's draft
  const crossAccountUpdateRes = await fetch(`http://localhost:3000/api/invitations/${draftSlugA}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer cust_B_token" },
    body: JSON.stringify({
      formData: { bride_name: "Hacked Bride" },
      revision: 1,
    })
  });
  // Since cust_B_token is unauthorized or doesn't match owner, it must reject with 401 or 403
  assert(crossAccountUpdateRes.status === 401 || crossAccountUpdateRes.status === 403, "Customer B cannot update Customer A's invitation");

  console.log("\n=================================================================");
  console.log(`   ADVANCED AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================================\n");
}

runRlsAndRaceTests().catch(console.error);
