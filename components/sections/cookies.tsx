'use client';
import { Button, Card, Link } from '@nextui-org/react';
import { useEffect, useState } from 'react';

export default function Cookies() {
  const [isCookie, setIsCookie] = useState(false);
  useEffect(() => {
    const cookiePolicy = localStorage.getItem('cookie-policy');
    if (cookiePolicy) {
      setIsCookie(false);
    } else {
      setIsCookie(true);
    }
  }, []);

  const handleCookie = () => {
    localStorage.setItem('cookie-policy', 'true');
    setIsCookie(false);
  };

  return (
    <>
      {isCookie && (
        <Card className="fixed bottom-2 left-0 right-0 z-50 mx-auto w-fit items-center gap-4 rounded-3xl bg-background px-3 py-2 text-foreground sm:flex-row sm:rounded-full sm:pl-8 md:bottom-10">
          <p className="text-center font-light">
            By browsing this website you agree to our{' '}
            <Link href={'/'} color="primary" className="hover:underline">
              {' '}
              cookie policy
            </Link>
          </p>
          <Button
            radius="full"
            color="primary"
            className="w-full sm:w-fit"
            onPress={handleCookie}
          >
            Agree
          </Button>
        </Card>
      )}
    </>
  );
}
