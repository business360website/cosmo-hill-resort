import { Armchair, Cloud, Sunset, BedDouble, Coffee, Laptop, Snowflake, Waves, Wine, Circle, Compass, Eye, Flame, Footprints, Leaf, Maximize, Mountain, Sparkles, Sunrise, Users, Utensils, Wifi, Sailboat, Wind, Landmark, Bath, Tv, PartyPopper, Mic, Projector, Cake, Heart, Briefcase, Gem, UtensilsCrossed } from 'lucide-react'

// Only icons referenced by name in resortData.js are bundled.
const map = { Armchair, Cloud, Sunset, BedDouble, Coffee, Laptop, Snowflake, Waves, Wine, Compass, Eye, Flame, Footprints, Leaf, Maximize, Mountain, Sparkles, Sunrise, Users, Utensils, Wifi, Sailboat, Wind, Landmark, Bath, Tv, PartyPopper, Mic, Projector, Cake, Heart, Briefcase, Gem, UtensilsCrossed }

export default function Icon({ name, ...props }) {
  const C = map[name] || Circle
  return <C aria-hidden="true" {...props} />
}
