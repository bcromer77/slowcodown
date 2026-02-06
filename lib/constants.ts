export const COUNTY_DOWN_LOCATIONS = [
  { value: "Strangford", label: "Strangford" },
  { value: "Newcastle", label: "Newcastle" },
  { value: "Downpatrick", label: "Downpatrick" },
  { value: "Bangor", label: "Bangor" },
  { value: "Portaferry", label: "Portaferry" },
  { value: "Killyleagh", label: "Killyleagh" },
  { value: "Ardglass", label: "Ardglass" },
  { value: "Dundrum", label: "Dundrum" },
  { value: "Warrenpoint", label: "Warrenpoint" },
  { value: "Rostrevor", label: "Rostrevor" },
  { value: "Hillsborough", label: "Hillsborough" },
  { value: "Comber", label: "Comber" },
  { value: "Greyabbey", label: "Greyabbey" },
  { value: "Holywood", label: "Holywood" },
  { value: "Saintfield", label: "Saintfield" },
  { value: "Ballynahinch", label: "Ballynahinch" },
  { value: "Donaghadee", label: "Donaghadee" },
  { value: "Crawfordsburn", label: "Crawfordsburn" },
  { value: "Castlewellan", label: "Castlewellan" },
  { value: "Helen's Bay", label: "Helen's Bay" },
  { value: "Groomsport", label: "Groomsport" },
  { value: "Tollymore", label: "Tollymore" },
  { value: "Kilbroney", label: "Kilbroney" },
  { value: "Mourne Mountains", label: "Mourne Mountains" },
  { value: "Lecale Peninsula", label: "Lecale Peninsula" },
  { value: "Ards Peninsula", label: "Ards Peninsula" },
] as const;

export const SENSES = [
  { value: "TASTE", label: "Taste" },
  { value: "SMELL", label: "Smell" },
  { value: "TEXTURE", label: "Texture" },
  { value: "SIGHT", label: "Sight" },
  { value: "SOUND", label: "Sound" },
] as const;

export const SEASONS = [
  { value: "SPRING", label: "Spring" },
  { value: "SUMMER", label: "Summer" },
  { value: "AUTUMN", label: "Autumn" },
  { value: "WINTER", label: "Winter" },
  { value: "ALL_YEAR", label: "All Year" },
] as const;

export const MOODS = [
  { value: "QUIET", label: "Quiet" },
  { value: "WARMING", label: "Warming" },
  { value: "CELEBRATORY", label: "Celebratory" },
  { value: "CONTEMPLATIVE", label: "Contemplative" },
  { value: "COMFORTING", label: "Comforting" },
] as const;

// Wander filters - language matters
export const WANDER_WHEN = [
  { value: "morning", label: "Morning" },
  { value: "long_lunch", label: "Long lunch" },
  { value: "evening", label: "Evening" },
  { value: "late", label: "Late" },
] as const;

export const WANDER_WEATHER = [
  { value: "clear", label: "Clear" },
  { value: "wet", label: "Wet" },
  { value: "cold", label: "Cold" },
  { value: "bright", label: "Bright" },
] as const;

export const WANDER_SENSE = [
  { value: "taste", label: "Taste" },
  { value: "smell", label: "Smell" },
  { value: "sound", label: "Sound" },
  { value: "touch", label: "Touch" },
  { value: "sight", label: "Sight" },
] as const;

export const WANDER_SETTING = [
  { value: "near_water", label: "Near water" },
  { value: "near_hills", label: "Near hills" },
  { value: "worth_the_drive", label: "Worth the drive" },
] as const;

export const BEST_ENJOYED_WHEN = [
  { value: "EARLY_MORNING", label: "Early morning" },
  { value: "LONG_LUNCH", label: "Long lunch" },
  { value: "LATE_EVENING", label: "Late evening" },
  { value: "AFTER_A_WALK", label: "After a walk" },
  { value: "WHEN_RAINING", label: "When it's raining" },
  { value: "CELEBRATORY", label: "Celebratory" },
  { value: "ALONE", label: "Alone" },
  { value: "WITH_FRIENDS", label: "With friends" },
] as const;

export const EXPERIENCE_CATEGORIES = [
  { value: "DRINKS", label: "Drinks", icon: "Wine", description: "Cocktails, whiskey & cosy pubs" },
  { value: "WALKS", label: "Walks", icon: "Footprints", description: "Trails & coastal paths" },
  { value: "SEA", label: "Sea", icon: "Waves", description: "Trips, kayaking & seals" },
  { value: "HIDDEN", label: "Hidden", icon: "Sparkles", description: "Secret places & treasures" },
  { value: "MAKERS", label: "Makers", icon: "Hammer", description: "Distilleries & craft" },
  { value: "MARKETS", label: "Markets", icon: "Store", description: "Farm shops & markets" },
  { value: "STAY", label: "Stay", icon: "Home", description: "Where to sleep" },
] as const;

export const MOOD_DESCRIPTIONS: Record<string, string> = {
  QUIET: "Something calm on a quiet afternoon",
  WARMING: "Something warm on a wet afternoon",
  CELEBRATORY: "A meal worth gathering for",
  CONTEMPLATIVE: "Food for thought",
  COMFORTING: "Like being cared for",
};

export const SEASON_DESCRIPTIONS: Record<string, string> = {
  SPRING: "Fresh beginnings",
  SUMMER: "Long days, light meals",
  AUTUMN: "Harvest and warmth",
  WINTER: "Slow cooking, deep flavours",
  ALL_YEAR: "Always",
};

export const BEST_ENJOYED_DESCRIPTIONS: Record<string, string> = {
  EARLY_MORNING: "As the day begins",
  LONG_LUNCH: "When time stretches",
  LATE_EVENING: "As darkness falls",
  AFTER_A_WALK: "When you've earned it",
  WHEN_RAINING: "Shelter from the storm",
  CELEBRATORY: "Worth gathering for",
  ALONE: "In your own company",
  WITH_FRIENDS: "Better shared",
};

// Editor's Letter - Kevin McMahon
export const EDITORS_LETTER = `County Down has always been a place people pass through on their way to somewhere else. That's their loss.

I've spent the better part of two decades eating my way across this county — not as a critic, not as a reviewer, but as someone who believes that how a place feeds you tells you everything about what it values.

What I've found here isn't fine dining in the conventional sense. It's something more honest: fishermen who know every rock in Strangford Lough. Farmers whose families have worked the same fields for generations. Chefs who've chosen to stay when they could have left for bigger cities and brighter lights.

Slow County Down isn't a directory. It's a promise.

Every place you find here meets a simple standard: they care more about what they're doing than about who's watching. There are no ratings because ratings encourage performance. There are no reviews because reviews invite argument. There's just the food, the place, and whether it's worth your time.

The menus disappear at midnight because today's cooking belongs to today. The courses remain as artifacts because some things deserve to be remembered.

If you're looking for the "best" of anything, you're in the wrong place. If you're looking for something true, you might find it here.

Eat slowly. Stay longer. Notice more.`;

export const EDITOR_TAGLINE = "Curated under the editorial standards of Kevin McMahon.";
export const EDITOR_TITLE = "Kevin McMahon";
export const EDITOR_ROLE = "Founding Editor & Custodian";
