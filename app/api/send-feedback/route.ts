import { NextResponse } from "next/server"
import { Resend } from "resend"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set.")
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { name, email, feedback } = await request.json()

    // Validate the input
    if (!name || !email || !feedback) {
      return NextResponse.json({ error: "Name, email, and feedback are required" }, { status: 400 })
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "ProFileScan Feedback <onboarding@resend.dev>", // Using Resend's default sender
      to: "sainaveen0981@gmail.com",
      subject: `New Feedback from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">New Feedback from ProFileScan</h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #555;">Feedback:</h3>
            <p style="white-space: pre-line;">${feedback}</p>
          </div>
          
          <p style="color: #777; font-size: 12px; text-align: center; margin-top: 30px;">
            This email was sent automatically from the ProFileScan website feedback form.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Error sending email:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in feedback API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
