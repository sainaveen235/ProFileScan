"use server";

import { analyzeResume } from "@/lib/analyze-resume";
import { AppError } from "@/lib/error-handler";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function analyzeResumeAction(resumeText: string) {
  try {
    if (!resumeText) {
      throw new AppError("Resume text is required", 400);
    }

    const analysis = await analyzeResume(resumeText);
    return { success: true, analysis };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to analyze resume", 500);
  }
}

export async function sendFeedbackAction(data: { name: string; email: string; feedback: string }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new AppError("Email service not configured", 500);
    }

    const { name, email, feedback } = data;

    if (!name || !email || !feedback) {
      throw new AppError("Name, email, and feedback are required", 400);
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "ProFileScan Feedback <onboarding@resend.dev>",
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
    });

    if (error) {
      throw new AppError("Failed to send email", 500);
    }

    return { success: true, data: emailData };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to send feedback", 500);
  }
} 