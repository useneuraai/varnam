import { saveRsvp, upsertInvitation, getInvitationBySlug, getRsvpsByInvitationSlug } from "../lib/db";

async function runPrelaunchTests() {
  console.log("=================================================================");
  console.log("   VARNAM PRE-LAUNCH SECURITY & PRODUCTION HARDENING AUDIT");
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
  // TEST 1: RSVP DUPLICATE POLICY & SAME-NAME DIFFERENT-GUEST ISOLATION
  // ---------------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 1: RSVP Consistency & Non-Accidental Merge Policy ---");
  const testInviteSlug = "test-security-invite-" + Date.now();

  // Create test published invitation
  await upsertInvitation({
    template_slug: "rose-classic",
    slug: testInviteSlug,
    bride_name: "Test Bride",
    groom_name: "Test Groom",
    wedding_date: "2027-01-01T10:00:00.000Z",
    wedding_venue: "Chennai Hall",
    status: "published",
    is_paid: true,
  });

  // Guest 1: Rahul Sharma, Phone: 9840111111
  const rsvp1 = await saveRsvp({
    invitation_slug: testInviteSlug,
    guest_name: "Rahul Sharma",
    guest_contact: "98401 11111",
    attendance_status: "attending",
    guest_count: 2,
    wishes: "Best wishes from Rahul 1!",
  });

  // Guest 2: Another person also named Rahul Sharma, but Phone: 9840222222
  const rsvp2 = await saveRsvp({
    invitation_slug: testInviteSlug,
    guest_name: "Rahul Sharma",
    guest_contact: "98402 22222",
    attendance_status: "attending",
    guest_count: 1,
    wishes: "Best wishes from Rahul 2!",
  });

  assert(rsvp1.id !== rsvp2.id, "Different guests with the same name but different phones are NOT merged");

  // Guest 1 updates their response: adds formatted phone "+91 98401-11111" and 3 guests
  const rsvp1Update = await saveRsvp({
    invitation_slug: testInviteSlug,
    guest_name: "Rahul Sharma (Updated)",
    guest_contact: "+91 98401-11111", // normalized matches 9840111111
    attendance_status: "attending",
    guest_count: 3,
    wishes: "Bringing 1 more!",
  });

  assert(rsvp1Update.id === rsvp1.id, "Same guest updating response with formatted phone updates existing record");
  assert(rsvp1Update.guest_count === 3, "Updated guest count is accurately recorded as 3");

  // Contactless Guest 3 with Device Token
  const tokenA = "device_token_client_A";
  const rsvp3 = await saveRsvp({
    invitation_slug: testInviteSlug,
    guest_name: "Priya",
    rsvp_token: tokenA,
    attendance_status: "attending",
    guest_count: 1,
    wishes: "Hearty congrats!",
  });

  // Contactless Guest 4 with different Device Token also named Priya
  const tokenB = "device_token_client_B";
  const rsvp4 = await saveRsvp({
    invitation_slug: testInviteSlug,
    guest_name: "Priya",
    rsvp_token: tokenB,
    attendance_status: "attending",
    guest_count: 2,
    wishes: "From Bangalore Priya",
  });

  assert(rsvp3.id !== rsvp4.id, "Contactless guests sharing the same name from different devices are NOT merged");

  // Contactless Guest 3 updates attendance from same device token
  const rsvp3Update = await saveRsvp({
    invitation_slug: testInviteSlug,
    guest_name: "Priya",
    rsvp_token: tokenA,
    attendance_status: "not_attending",
    guest_count: 0,
    wishes: "Sorry, won't be able to make it",
  });

  assert(rsvp3Update.id === rsvp3.id, "Contactless guest from same device updates their own record");
  assert(rsvp3Update.attendance_status === "not_attending", "Attendance status updated to not_attending");

  // ---------------------------------------------------------------------------------
  // TEST 2: PAYMENT TAMPERING & INTEGRITY VALIDATION
  // ---------------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 2: Payment Tampering & Price Integrity ---");

  // Test order verification with mismatched template
  const verifyResWrongTemplate = await fetch("http://localhost:3000/api/payments/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer mock-user-token" },
    body: JSON.stringify({
      razorpay_order_id: "order_mock_test_123",
      razorpay_payment_id: "pay_mock_test_123",
      razorpay_signature: "sig123",
      templateSlug: "invalid-template",
      formData: { bride_name: "A", groom_name: "B" }
    })
  });
  assert(verifyResWrongTemplate.status === 400, "Payment verification rejects invalid template references (400)");

  // Test order verification without server key secret
  const verifyResNoSecret = await fetch("http://localhost:3000/api/payments/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer mock-user-token" },
    body: JSON.stringify({
      razorpay_order_id: "order_mock_test_123",
      razorpay_payment_id: "pay_mock_test_123",
      razorpay_signature: "sig123",
      templateSlug: "rose-classic",
      formData: { bride_name: "A", groom_name: "B" }
    })
  });
  // Since order does not exist or key secret is not live, it must reject with 404 or 500
  assert(verifyResNoSecret.status === 404 || verifyResNoSecret.status === 500, "Forged or non-existent order verification is rejected");

  // ---------------------------------------------------------------------------------
  // TEST 3: AUTOSAVE CONFLICT & REVISION CONTROL (HTTP 409)
  // ---------------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 3: Autosave Concurrency & Revision Control ---");

  const conflictSlug = "conflict-test-" + Date.now();
  // Save revision 1
  const save1 = await fetch("http://localhost:3000/api/invitations/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer mock-user-token" },
    body: JSON.stringify({
      slug: conflictSlug,
      templateSlug: "rose-classic",
      formData: { bride_name: "Ananya", groom_name: "Siddharth", wedding_venue: "Chennai" },
      revision: 1,
    })
  });
  const data1 = await save1.json();
  assert(save1.ok && data1.revision === 1, "Draft initial save succeeds at revision 1");

  // Tab A saves revision 2
  const save2 = await fetch("http://localhost:3000/api/invitations/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer mock-user-token" },
    body: JSON.stringify({
      slug: conflictSlug,
      templateSlug: "rose-classic",
      formData: { bride_name: "Ananya Updated in Tab A", groom_name: "Siddharth", wedding_venue: "Chennai" },
      revision: 2,
    })
  });
  const data2 = await save2.json();
  assert(save2.ok && data2.revision === 2, "Tab A saves updated draft advancing server revision to 2");

  // Tab B attempts to write with stale revision 1
  const saveStale = await fetch("http://localhost:3000/api/invitations/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer mock-user-token" },
    body: JSON.stringify({
      slug: conflictSlug,
      templateSlug: "rose-classic",
      formData: { bride_name: "Ananya", groom_name: "Siddharth Tab B", wedding_venue: "Chennai" },
      revision: 1, // Stale!
    })
  });
  assert(saveStale.status === 409, "Server rejects stale client revision with HTTP 409 Conflict");
  const conflictData = await saveStale.json();
  assert(conflictData.serverRevision === 2, "Conflict response returns serverRevision = 2 for automatic sync");

  // ---------------------------------------------------------------------------------
  // TEST 4: RSVP SPAM TRAP & RATE LIMITING
  // ---------------------------------------------------------------------------------
  console.log("\n--- TEST GROUP 4: Spam Protection & Honeypot Trap ---");

  // Bot submission with honeypot field filled
  const botRes = await fetch("http://localhost:3000/api/rsvps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invitationSlug: testInviteSlug,
      name: "Spam Bot",
      website: "http://spam-link.example.com", // Honeypot filled!
      attendance: "yes",
      wishes: "Buy cheap crypto!",
    })
  });
  const botData = await botRes.json();
  assert(botData.rsvp?.id === "rsvp_bot_ack", "Honeypot trap silently neutralizes bot without writing to database");

  // Verify that spam bot response was NOT added to the invitation RSVPs
  const allRsvps = await getRsvpsByInvitationSlug(testInviteSlug);
  const foundBot = allRsvps.find((r) => r.guest_name === "Spam Bot" || r.wishes?.includes("crypto"));
  assert(!foundBot, "Database confirms zero spam records saved from honeypot bot trap");

  // Test name character validation
  const scriptRes = await fetch("http://localhost:3000/api/rsvps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      invitationSlug: testInviteSlug,
      name: "<script>alert('xss')</script>",
      attendance: "yes",
    })
  });
  assert(scriptRes.status === 400, "XSS/Script injection attempts in guest name are rejected with 400");

  console.log("\n=================================================================");
  console.log(`   AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================================\n");
}

runPrelaunchTests().catch(console.error);
