import { getWebsite } from '@/functions/get';
import { Website as WebsiteInterface } from '@/lib/interface';
import Website from '@/components/dashboard/website/website';
export default async function Page() {
  const website: WebsiteInterface = await getWebsite();

  return (
    <>
      <Website website={website} />
    </>
  );
}
