import Image, { type ImageProps } from "next/image";
import { SUPABASE_URL } from "@/lib/env";

/**
 * next/image wrapper: optimises local images and Supabase Storage images
 * (configured in next.config.ts); anything else is rendered unoptimised so an
 * unexpected host never crashes the page.
 */
export function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : null;
  const optimisable =
    !src || src.startsWith("/") || (SUPABASE_URL !== "" && src.startsWith(SUPABASE_URL));
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is required by ImageProps
  return <Image {...props} unoptimized={props.unoptimized ?? !optimisable} />;
}
