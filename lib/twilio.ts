function getTwilioCredentials(): { accountSid: string; authToken: string; fromNumber: string } | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER || "";

  if (!accountSid || !authToken) {
    console.log("Twilio credentials not configured");
    return null;
  }

  return { accountSid, authToken, fromNumber };
}

export async function sendSMS(to: string, message: string): Promise<{ success: boolean; error?: string }> {
  const creds = getTwilioCredentials();
  if (!creds) {
    return { success: false, error: "Twilio not configured" };
  }

  const { accountSid, authToken, fromNumber } = creds;
  
  // Format phone number - ensure it starts with +
  const formattedTo = to.startsWith("+") ? to : `+${to}`;
  
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: formattedTo,
          From: fromNumber,
          Body: message,
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Twilio error:", data);
      return { success: false, error: data.message || "Failed to send SMS" };
    }

    return { success: true };
  } catch (error) {
    console.error("SMS send error:", error);
    return { success: false, error: "Network error sending SMS" };
  }
}

export function isTwilioConfigured(): boolean {
  return getTwilioCredentials() !== null;
}
