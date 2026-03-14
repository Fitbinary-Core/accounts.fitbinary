import z from "zod";

// Zod schema
export const businessDetailsSchema = z
  .object({
    business_name: z.string().min(1, "Business name is required"),
    business_logo: z.string().optional(),
    business_description: z.string().optional(),
    business_type: z.string().optional(),
    business_size: z.string().optional(),
    business_email: z
      .string()
      .email("Invalid email")
      .optional()
      .or(z.literal("")),
    business_phone: z.string().optional(),
    is_registered: z.boolean(),
    registration_status: z.string().optional(),
    registration_number: z.string().optional(),
    has_pan: z.boolean().optional(),
    pan_number: z.string().optional(),
    is_vat_registered: z.boolean().optional(),
    vat_number: z.string().optional(),
    verification_documents: z.array(
      z.object({
        document_type: z.string(),
        document_number: z.string().optional().or(z.literal("")),
        document_photo: z.string().optional().or(z.literal("")),
        _file: z.any().optional(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.is_registered) {
      const hasRegistration = !!data.registration_number;
      const hasPan = data.has_pan && !!data.pan_number;
      const hasVat = data.is_vat_registered && !!data.vat_number;

      if (!hasRegistration && !hasPan && !hasVat) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "At least one registration document (Registration, PAN, or VAT) is required when registered",
          path: ["registration_number"],
        });
      }
    }
  });

// Type
export type BusinessDetailsFormData = z.infer<typeof businessDetailsSchema>;
