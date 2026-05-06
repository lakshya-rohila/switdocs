export function useExport() {
  return {
    formats: ['png', 'jpg', 'pdf', 'docx'] as const,
    exportSignedMock: async () => undefined as string | undefined,
  };
}
