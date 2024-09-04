import { create } from "zustand";

interface StripeModalStore {
  isOpen: boolean;
  onOpen(): void;
  onClose(): void;
}

export const useStripeModal = create<StripeModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
