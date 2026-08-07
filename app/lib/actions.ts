"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createMeeting, updateMeeting } from "./meeting-db";
import { auth } from "./auth";
import type { CreateMeetingInput, UpdateMeetingInput } from "./types";

const hymnSchema = z.object({
  number: z.number().int().min(0),
  title: z.string(),
});

const speakerSchema = z.object({
  name: z.string(),
  topic: z.string(),
  type: z.enum(["speaker", "musical-number"]),
});

const wardBusinessSchema = z.object({
  description: z.string(),
});

const createMeetingSchema = z.object({
  date: z.string().min(1, "Date is required"),
  meetingType: z.enum(["testimony", "regular", "stake", "general"]),
  presiding: z.string().min(1, "Presiding is required"),
  conducting: z.string().min(1, "Conducting is required"),
  announcements: z.array(z.string()).optional(),
  openingHymn: hymnSchema.optional(),
  openingPrayer: z.string().optional(),
  wardBusiness: z.array(wardBusinessSchema).optional(),
  stakeBusiness: z.boolean().optional(),
  sacramentHymn: hymnSchema.optional(),
  speakers: z.array(speakerSchema).optional(),
  closingHymn: hymnSchema.optional(),
  closingPrayer: z.string().optional(),
});

const updateMeetingSchema = z.object({
  date: z.string().optional(),
  meetingType: z.enum(["testimony", "regular", "stake", "general"]).optional(),
  presiding: z.string().optional(),
  conducting: z.string().optional(),
  announcements: z.array(z.string()).optional(),
  openingHymn: hymnSchema.optional(),
  openingPrayer: z.string().optional(),
  wardBusiness: z.array(wardBusinessSchema).optional(),
  stakeBusiness: z.boolean().optional(),
  sacramentHymn: hymnSchema.optional(),
  speakers: z.array(speakerSchema).optional(),
  closingHymn: hymnSchema.optional(),
  closingPrayer: z.string().optional(),
});

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
} | null;

export async function createMeetingAction(prevState: ActionState, payload: CreateMeetingInput): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "You must be signed in to create a meeting." };
  }

  const validated = createMeetingSchema.safeParse(payload);
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the highlighted errors.",
    };
  }

  const result = await createMeeting(JSON.parse(JSON.stringify(validated.data)));
  if ("error" in result) {
    return { message: result.error };
  }

  revalidatePath("/meetings");
  redirect(`/meetings/${result.id}`);
}

export async function updateMeetingAction(
  prevState: ActionState,
  payload: { id: number } & UpdateMeetingInput,
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "You must be signed in to update a meeting." };
  }

  const { id, ...data } = payload;
  const validated = updateMeetingSchema.safeParse(data);
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the highlighted errors.",
    };
  }

  const result = await updateMeeting(id, JSON.parse(JSON.stringify(validated.data)));
  if ("error" in result) {
    return { message: result.error };
  }

  revalidatePath("/meetings");
  redirect(`/meetings/${id}`);
}
