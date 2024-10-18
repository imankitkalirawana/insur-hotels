import { Card, Carousel } from '@/components/ui/apple-cards-carousel';
import { Hotel } from '@/lib/interface';

interface Props {
  items: Hotel[];
}

export default function AppleCarousel({ items }: Props) {
  const cards = items.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));
  return (
    <div id="locations" className="mx-auto flex flex-col items-center py-8">
      <Carousel items={cards} />
    </div>
  );
}
