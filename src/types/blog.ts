import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  author: z.string().min(2, 'Author name is required'),
  category: z.string().min(1, "Category is required"),
  author_title: z.string().optional(),
  author_image: z.string().url("Author image must be a valid URL").optional().or(z.literal('')),
  read_time: z.string().min(1, "Read time is required"),
  image: z.string().url("Image must be a valid URL"),
  published: z.boolean().default(false),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;
