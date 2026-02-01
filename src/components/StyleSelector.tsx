import { Check } from "lucide-react";

export interface Style {
  id: string;
  name: string;
  image: string;
  description: string;
  prompt: string; // AI prompt description
}

export const styles: Style[] = [
  {
    id: "casual",
    name: "休闲日常",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop",
    description: "舒适自然的日常穿搭",
    prompt: "casual everyday outfit: a comfortable cotton t-shirt in a soft neutral color, paired with well-fitted jeans and clean white sneakers"
  },
  {
    id: "business",
    name: "商务正装",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&h=400&fit=crop",
    description: "专业干练的职场风格",
    prompt: "professional business attire: a tailored navy blue suit with a crisp white dress shirt, silk tie, and polished leather oxford shoes"
  },
  {
    id: "streetwear",
    name: "街头潮流",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&h=400&fit=crop",
    description: "个性张扬的潮流穿搭",
    prompt: "trendy streetwear style: an oversized graphic hoodie, cargo pants, chunky sneakers, and a snapback cap with gold chain accessories"
  },
  {
    id: "elegant",
    name: "优雅礼服",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop",
    description: "高贵典雅的正式场合",
    prompt: "elegant formal evening wear: a sophisticated black-tie outfit with a floor-length evening gown or classic tuxedo, accessorized with elegant jewelry"
  },
  {
    id: "sporty",
    name: "运动活力",
    image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=300&h=400&fit=crop",
    description: "活力四射的运动风格",
    prompt: "athletic sportswear: a fitted performance top with moisture-wicking fabric, stylish athletic leggings or shorts, and modern running shoes"
  },
  {
    id: "vintage",
    name: "复古怀旧",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=400&fit=crop",
    description: "经典复古的时尚韵味",
    prompt: "vintage retro style from the 1970s: high-waisted flared pants, a fitted turtleneck sweater, platform shoes, and round sunglasses"
  }
];

interface StyleSelectorProps {
  selectedStyle: string | null;
  onStyleSelect: (styleId: string) => void;
}

export function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">选择穿搭风格</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={`style-card rounded-xl overflow-hidden text-left ${
              selectedStyle === style.id ? "selected" : ""
            }`}
          >
            <div className="relative aspect-[3/4]">
              <img
                src={style.image}
                alt={style.name}
                className="w-full h-full object-cover"
              />
              {selectedStyle === style.id && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-3">
              <h4 className="font-medium text-foreground">{style.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{style.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
