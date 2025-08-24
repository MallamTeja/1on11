// We're moving the useToast hook to a more accessible location
// while maintaining compatibility with any code that imports from either location.
// This re-export allows for gradual migration and maintains the existing API
// while providing a more intuitive location for the hook.

export { useToast, toast } from "@/components/ui/use-toast";