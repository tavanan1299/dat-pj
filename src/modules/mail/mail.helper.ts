export function getOtpTemplate(payload: GetOTPTemplatePayload) {
	const { otp, expiresInMinute } = payload;

	return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Coiner</a>
      </div>
      <p style="font-size:1.1em">Hi,</p>
      <p>Welcome. Use the following OTP to complete your process. OTP is valid for ${expiresInMinute} minutes</p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p style="font-size:0.9em;">Regards,<br />Admin</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Admin.</p>
      </div>
    </div>
  </div>`;
}
