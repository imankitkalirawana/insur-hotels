import { Icon } from '@iconify/react/dist/iconify.js';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <div className="flex h-screen items-center justify-center gap-1">
        <Icon icon="mingcute:loading-fill" className="animate-spin" />
        <span>Loading...</span>
      </div>
    </>
  );
}
