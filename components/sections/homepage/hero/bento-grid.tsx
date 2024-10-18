import Grid from '@/components/animata/bento-grid/grid';

export default function BentoGrid() {
  return (
    <>
      <div className="relative flex min-h-screen w-full translate-y-0 flex-col items-center justify-between bg-cover px-4 py-24">
        <div className="relative flex h-full w-full max-w-7xl flex-col items-center justify-between gap-12">
          <div>
            <h2 className="font-lovelace text-2xl font-black text-[#2d2e2c] md:text-4xl">
              What Sets Insur Apart?
            </h2>
          </div>
          <Grid />
        </div>
      </div>
    </>
  );
}
