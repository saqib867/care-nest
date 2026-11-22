import { create } from "zustand";
import { MockCaregiver } from "@/lib/mockData";

export type ModalType = "requestCare" | null;

interface ModalStore {
  isOpen: boolean;
  type: ModalType;
  data: {
    caregiver?: MockCaregiver;
  };
  openModal: (type: ModalType, data?: { caregiver?: MockCaregiver }) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  type: null,
  data: {},
  openModal: (type, data = {}) => set({ isOpen: true, type, data }),
  closeModal: () => set({ isOpen: false, type: null, data: {} }),
}));
