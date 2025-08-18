import { defineCollection, z } from 'astro:content';

const restaurants = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    cuisine: z.string(),
    priceRange: z.enum(['$', '$$', '$$$', '$$$$']),
    address: z.string(),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    hours: z.string(),
    website: z.string().optional(),
    phone: z.string().optional(),
    image: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    googleMapsUrl: z.string().optional(),
    googleRating: z.number().optional(),
    googleReviews: z.number().optional(),
    recommended: z.array(z.object({
      name: z.string(),
      description: z.string(),
      price: z.string().optional(),
      image: z.string().optional(),
    })).optional(),
  }),
});

const dishes = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    category: z.enum(['sladký', 'hlavní jídla', 'polívky', 'snacks']),
    order: z.number().optional(),
    KarelMustTry: z.boolean().optional(),
    description: z.string(),
    image: z.string().optional(),
    whyTry: z.string(),
    quote: z.string(),
    author: z.string(),
  }),
});

export const collections = {
  restaurants,
  dishes,
};