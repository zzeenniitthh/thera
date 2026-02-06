import { create } from 'zustand';

interface UIState {
  isGenerating: boolean;
  selectedNodeId: string | null;
  modalOpen: string | null;

  setGenerating: (val: boolean) => void;
  setSelectedNode: (id: string | null) => void;
  openModal: (modal: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isGenerating: false,
  selectedNodeId: null,
  modalOpen: null,

  setGenerating: (val) => set({ isGenerating: val }),
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  openModal: (modal) => set({ modalOpen: modal }),
  closeModal: () => set({ modalOpen: null }),
}));
