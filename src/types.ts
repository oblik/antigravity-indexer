import { Event, Context } from "@/generated";

export interface Inputs {
    event: Event,
    context: Context,
}

export interface ContextInputs {
    context: Context,
}