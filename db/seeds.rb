# Delete old entries
Pest.delete_all
Crop.delete_all

## Foliar diseases ##
early_blight = EarlyBlight.create!(
  name: "Early Blight (Potato, Tomato)",
  remote_name: "potato_p_days",
  biofix_mm: 1, biofix_dd: 1,
  info: "<p><b>Early blight</b> is one of two common fungal diseases that can devastate tomatoes and potatoes in both commercial settings and home gardens. Early blight can also be a serious disease on other popular Solanaceous vegetables including eggplants, and peppers. Symptoms of early blight first appear at the base of affected plants, where roughly circular brown spots appear on leaves and stems. As these spots enlarge, concentric rings appear giving the areas a target-like appearance. Often spots have a yellow halo. Eventually multiple spots on a single leaf will merge, leading to extensive destruction of leaf tissue. Early blight can lead to total defoliation of lower leaves and even the death of an infected plant. Early blight is caused by the fungus <i>Alternaria solani</i>, which survives in plant debris or on infected plants. Early blight symptoms typically begin as plant canopies start to close. Denser foliage leads to high humidity and longer periods of leaf wetness that favor the disease. The risk of Early Blight is greatest after the accumulation of 300 physiological days (P-Days) in a season.</p>",
  photo: "tomato-early-blight.jpg",
  link: "https://vegpath.plantpath.wisc.edu/"
)

late_blight = LateBlight.create!(
  name: "Late Blight (Potato, Tomato)",
  remote_name: "potato_blight_dsv",
  biofix_mm: 1, biofix_dd: 1,
  info: "<p><b>Late blight</b>: <i>Phytophthora infestans</i> infects all aboveground plant parts and potato tubers and can be transmitted via seed, culls, volunteers, and weeds (i.e., nightshade). Foliar infections begin with watersoaking and progress quickly to cause tan/brown dead tissue. Brown cankers can girdle petioles and stems. White, downy sporulation is often visible, with high humidity, on undersides of leaves along lesion edges. Infected tomato fruits remain firm underneath mottled-looking brown areas. Infected tubers appear as brown decay on the surface and into the top ¼-inch of tissue. Late blight disease advances quickly under conditions of high humidity (≥90%) and cool temperatures (50-70°F). Prevention is critical for control. Eliminate culls and volunteer plants. Avoid prolonged wetness on leaves and canopy, use certified seed, and follow DSV accumulation values that prompt early, preventative fungicide applications. If disease is present, treat with appropriate fungicides on a 5-7 day spray interval.</p>",
  photo: "potato-late-blight.png",
  link: "https://vegpath.plantpath.wisc.edu/"
)

foliar_disease = FoliarDisease.create!(
  name: "Foliar Disease (Carrot)",
  remote_name: "carrot_foliar_dsv",
  biofix_mm: 1, biofix_dd: 1,
  info: "<p><b>Alternaria leaf blight</b>: the seedborne <i>Alternaria</i> fungus causes dark-brown lesions on leaflets and petioles that weaken and/or kill carrot foliage, causing separation from root crowns during mechanical harvest. Disease management includes using certified or heat-treated seed, crop rotation, in-furrow irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.</p><p><b>Cercospora leaf blight</b>: the potentially seedborne <i>Cercospora</i> fungus causes tan lesions with a darker brown margin on carrot leaflets and petioles. Plant growth can be reduced from dead, curled leaflets and, in severe cases, death of the entire canopy. Disease management includes using certified or pre-treated seed, crop rotation, avoiding overhead irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.</p>",
  photo: "carrot-foliar-disease.png",
  link: "https://vegpath.plantpath.wisc.edu/"
)

cercospora_leaf_spot = CercosporaLeafSpot.create!(
  name: "Cercospora Leaf Spot (Beet)",
  remote_name: "cercospora_div",
  biofix_mm: 1, biofix_dd: 1,
  info: "<p><b>Cercospora leaf spot (CLS)</b> and resultant defoliation is caused by the fungus <i>Cercospora beticola</i> Sacc. and is one of the most damaging diseases of table and sugar beet crops worldwide.  Disease symptoms are initially discrete and necrotic lesions with red to purple margins red table beets. Lesions have gray centers and contain diagnostic fungal structures (pseudostromata). For large scale table beet production, defoliation may lead to challenges with mechanical harvest and crop loss. For fresh market, 'bunched beet' sale, foliar lesions can result in rejection. CLS control in conventional table beet requires preventative fungicide applications. Timing of the application of fungicides with disease forecasting can greatly enhance control to limit inoculum within the crop for full season disease control.</p>",
  link: "https://vegpath.plantpath.wisc.edu/"
)


## Insect models ##
alfalfa_weevil = DegreeDayPest.create!(
  name: "Alfalfa Weevil",
  remote_name: 'dd_48_none',
  biofix_mm: 1, biofix_dd: 1,
  t_min: 48, t_max: nil,
  risk_start: 300, risk_peak: 504, risk_end: 814,
  info: "<p><i>Hypera postica</i>, commonly known as the alfalfa weevil, is a species of beetle in the superfamily Curculionoidea; it can be found in alfalfa fields throughout Europe and North America. Considered a destructive threat to alfalfa production in North America, several accidental introductions have been successfully countered though the use of a variety of biological control species.</p><p>The alfalfa weevil grows to a length of about 4 to 5.5 mm (0.16 to 0.22 in). The rostrum or beak is short and broad. The frons is half as wide as the rostrum while the pronotum is broadest in the centre. The general colour of the insect is brown, with a dark mid-dorsal stripe. The larva has a distinctive black head and no legs; it is yellowish-green, with a white dorsal stripe and faint white lateral stripes. It is about 1 cm (0.4 in) long just before pupation. It pupates in a white, pea-sized cocoon made of loosely-woven silk. It resembles the clover leaf weevil (<i>Hypera punctata</i>), but that species is nearly twice as large, the larvae have tan heads and they seldom cause much damage to alfalfa crops.</p><p>In the midwest, some eggs are laid in the late fall or the winter, when weather conditions permit. Adults also overwinter and become increasingly active in March and April. Eggs are laid in batches of up to 25 inside alfalfa stems. The larvae feed for three or four weeks, moulting three times, before pupating in the cocoons they make. They emerge as adults in about one or two weeks. After feeding for a week or two, they may experience aestivation during the remainder of the summer, in which they demonstrate a dampening of their metabolic, respiratory and nervous system activities. In fall, the adults hide in the crowns of alfalfa plants or move onto coarse vegetation in ditches or by fences or in nearby woodland.</p>",
  severity_info: "Alfalfa weevil egg hatch begins around 300 FDD. Light feeding damage expected during 1st and 2nd instar life stages (350-500 FDD). Heavy feeding damage expected during 3rd and 4th instar development, approx. 400-600 FDD.",
  photo: "alfalfa-weevil.jpg",
  link: "https://en.wikipedia.org/wiki/Hypera_postica"
)

asparagus_beetle = DegreeDayPest.create!(
  name: "Asparagus Beetle (Common)",
  remote_name: "dd_50_86",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 50, t_max: 86,
  risk_start: 105, risk_peak: 250, risk_end: 405,
  info: "<p>The common (<i>Crioceris asparagi</i>) and spotted (<i>Crioceris duodecimpunctata</i>) asparagus beetles are annual pests of asparagus in Wisconsin. The common asparagus beetle is the most prevalent and the only one that causes economic damage to asparagus.</p><p>Adults of the common asparagus beetle feed on the plant’s spears and ferns. Disfigured and unmarketable spears can result when the beetles feed or lay eggs on the spears. Spotted asparagus beetle larvae feed more on the berries rather than the ferns of asparagus.  Larvae secrete a black fluid onto the plants. Spring spear feeding reduces crop quality (browning, scarring, staining, and bent growth). Summer fern feeding can cause defoliation and reduces yield of subsequent years. Eggs laid on spears are unattractive to consumers, though harmless. Large populations of asparagus beetles, if left unchecked, can defoliate the plants.</p><p>Asparagus beetle overwinters in plant debris and brush as an adult. Adults become active in spring when new spears emerge. The spotted asparagus beetle becomes active later in spring than the common asparagus beetle. Common asparagus beetles lay eggs on spears while spotted asparagus beetles lay eggs on ferns. About a week later eggs hatch. The larvae feed for about two weeks on asparagus and then pupate in the soil. About one week later the next generation of adults hatch.  Two to three generations occur in a growing season. Most larvae and adults are more active in the afternoon when the temperature and sunlight are at their peak.</p>",
  severity_info: "Egg hatch begins around 105 FDD, with peak larvae around 250 FDD and last larvae around 405 FDD. Peak adults around 570 FDD.",
  photo: "asparagus-beetle-common.jpg",
  link: "https://vegento.russell.wisc.edu/pests/asparagus-beetle/"
)

black_cutworm = DegreeDayPest.create!(
  name: "Black Cutworm",
  remote_name: "dd_50_86",
  biofix_mm: 5, biofix_dd: 15,
  t_min: 50, t_max: 86,
  risk_start: 300, risk_peak: 700, risk_end: 1000,
  info: "<p>Black cutworm larvae feed on newly emerged vegetable crops. The worms are active feeders, clipping many seedlings at or below the soil line in a single night. They prefer crops sown as seed (rather than transplants); susceptible crops include beets, carrots, cucumber, leafy greens, melons, peas, potato, pumpkin, snap beans, squash, and sweet corn. If not controlled, these pests can destroy approximately a third of planting. Black cutworms are particularly problematic to fresh market growers and home gardeners. As an adult moth, the black cutworm may be referred to as the Dark sword-grass or the Ipsilon dart.</p><p>The dark gray to black larvae have a greasy appearance and a grainy texture. Mature larvae grow to 1 ½ inches long. When disturbed, cutworms curl up into a tight C-shape. Adults are gray moths that have a series of distinctive dark markings on their forewings (including a dagger-shape on each outer forewing) and lighter colored hind wings.</p><p>The black cutworm doesn’t overwinter in Wisconsin. Instead, the adult moth migrates north on storm fronts in early spring, usually in May and early June. Females lay eggs on low-growing vegetation such as chickweed, curly dock, cruciferous weeds, and plant residue. Larvae hatch about 5-10 days later and over the course of a month will pass through six instars (growth stages) before pupating. Larvae migrate from mature vegetation to seedlings when they’re about ¾ inches long. About 2 weeks after entering the pupal stage, adult moths emerge, mate, and repeat the cycle. In Wisconsin, three generations emerge each year.</p>",
  severity_info: "Egg hatch begins around 180 FDD, with leaf cutting and larval development starting around 300 FDD and extending through 1000 FDD.",
  photo: "cutworm-larvae.jpg",
  link: "https://vegento.russell.wisc.edu/pests/black-cutworm/"
)

stink_bug = DegreeDayPest.create!(
  name: "Brown Marmorated Stink Bug",
  remote_name: "dd_54_92",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 54, t_max: 92,
  risk_start: 1608, risk_peak: 1734, risk_end: 2022,
  info: "<p>Adult brown marmorated stink bugs are approximately 1.7 cm (0.67 in) long and about as wide, forming the heraldic shield shape characteristic of bugs in the superfamily Pentatomoidea. They are generally a dark brown when viewed from above, with a creamy white-brown underside. Individual coloration may vary, with some bugs being various shades of red, grey, light brown, copper, or black. The term 'marmorated' means variegated or veined, like marble, which refers to the markings unique to this species, includes alternating light-colored bands on the antennae and alternating dark bands on the thin outer edge of the abdomen. The legs are brown with faint white mottling or banding.</p><p>The nymph stages are black or very dark brown, with red integument between the sclerites. First instar nymphs have no white markings, but second through fifth instar nymphs have black antennae with a single white band. The legs of nymphs are black with varying amounts of white banding. Freshly molted individuals of all stages are pale white with red markings. Eggs are normally laid on the underside of leaves in masses of 28 eggs, and are light green when laid, gradually turning white.</p><p>Like all stink bugs, the glands that produce the defensive chemicals (the 'stink') are located on the underside of the thorax, between the first and second pair of legs.</p>",
  severity_info: "First generation adults typically develop by around 1608 FDD. Adult feeding is most damaging. Only one generation per year is typical in Wisconsin.",
  photo: "bmsb.jpg",
  link: "https://en.wikipedia.org/wiki/Brown_marmorated_stink_bug"
)

cabbage_looper = DegreeDayPest2.create!(
  name: "Cabbage Looper",
  remote_name: "dd_50_90",
  biofix_mm: 5, biofix_dd: 15,
  t_min: 50, t_max: 90,
  risk_start: 325, risk_peak: 520, risk_end: 750,
  risk_start2: 1115, risk_peak2: 1310, risk_end2: 1540,
  info: "<p>The cabbage looper (<i>Trichoplusia ni</i>) is a medium-sized moth in the family Noctuidae, a family commonly referred to as owlet moths. Its common name comes from its preferred host plants and distinctive crawling behavior. Cruciferous vegetables, such as cabbage, bok choy, and broccoli, are its main host plant; hence, the reference to cabbage in its common name. The larva is called a looper because it arches its back into a loop when it crawls.</p><p>While crucifers are preferred, over 160 plants can serve as hosts for the cabbage looper larvae. The adult cabbage looper is a migratory moth that can be found across North America and Eurasia, as far south as Florida and as far north as British Columbia. Its migratory behavior and wide range of host plants contribute to its broad distribution.</p><p>The cabbage looper larva is a minor vegetable pest, especially for crucifers. While it is not significantly destructive, it is becoming difficult to manage due to its broad distribution and resistance to many insecticides. Numerous methods are being researched in order to control this species.</p>",
  severity_info: "The first small larvae appear around 325 FDD after the May 15 biofix date. Feeding continues and worsens as larvae grow, peaking around 520 FDD and ending around 750 FDD. Second generation larvae may begin appearing around 1115 FDD, peak around 1310 FDD, and end around 1540 FDD.",
  photo: "cabbage-looper.jpg",
  link: "https://vegento.russell.wisc.edu/pests/caterpillar-pests-of-cole-crops/"
)

cabbage_maggot = DegreeDayPest2.create!(
  name: "Cabbage Maggot",
  remote_name: "dd_42p8_86",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 42.8, t_max: 86,
  risk_start: 360, risk_peak: 600, risk_end: 1521,
  risk_start2: 1881, risk_peak2: 2121, risk_end2: 3042,
  info: "<p>Cabbage maggots (<i>Delia radicum</i>) are early season pests that feed on the roots and lower stems of all cruciferous crops and weeds. Wounds produced by this feeding can create entry points for several cole crop diseases. Early season transplants and spring roots crops are damaged most severely.</p><p>The adult cabbage maggot is an ash gray, bristly fly that resembles a housefly but is half as long with black stripes on its thorax. The larvae are only 1/3-inch long, white and have no legs and a body that tapers toward the head. Cabbage maggots appear similar to seed corn maggots, but cabbage maggot prefers to feed on the roots of cole crops while seed corn maggot prefers to feed on seeds and seedlings of corn and cucurbits.</p><p>Cabbage maggots feed both internally and on the surface of roots. Their tunneling provides a point of entry into the plant for pathogens such as soft rot bacteria and the blackleg fungus. Maggots can be especially damaging to seedlings, injuring the growing point of the root, and stunting plant growth. Affected seedlings and young transplants may become off-color or wilt during hot weather. Cabbage maggots thrive in wet, cool conditions, and injury to crops is most likely during first and third generations.</p>",
  severity_info: "Spring adult emergence begins around 360 FDD with peak emergence at around 600 FDD. Management actions targeting adults is recommended at this time. Adults will lay eggs from 750-1521 FDD when spring flight concludes.",
  photo: "cabbage-maggot.jpg",
  link: "Adult emergence occurs around 360 FDD, with peak emergence occurring around 600 FDD. Egg laying occurs from around 750 FDD to 1500 FDD with a peak around 1050 FDD. Second generation adult emergence begins around 1880 FDD and peaks around 2120 FDD, with egg-laying occurring from 2270 FDD through 3040 FDD."
)

colorado_potato_beetle = DegreeDayPest2.create!(
  name: "Colorado Potato Beetle",
  remote_name: "dd_52_none",
  biofix_mm: 5, biofix_dd: 1,
  t_min: 52, t_max: nil,
  risk_start: 120, risk_peak: 400, risk_end: 675,
  risk_start2: 900, risk_peak2: 1400, risk_end2: 1800,
  info: "<p>The Colorado potato beetle (<i>Leptinotarsa decemlineata</i>) is a significant pest of potato, eggplant and pepper in home gardens as well as fresh market agricultural production. When not controlled, Colorado potato beetle (CPB) can completely defoliate plants resulting in serious yield losses or even plant death. Beetles prefer to feed on potato, but will also use eggplant and other solanaceous crops. Both larval and adult life stages commonly cause damage to plants throughout the growing season. CPB is a persistent pest annually, once an infestation occurs beetle populations tend to increase annually. When potato is unavailable in the environment CPB can utilize alternate solanaceous host plants such as eastern black and deadly black nightshade, jimson-weed, Carolina horse-nettle and buffalo-bur. Common solanaceous weeds in the environment are thought to provide a green bridge enabling potato beetle colonization into new environments.</p>",
  severity_info: "Adjust biofix date to match date of first egg mass discovery. Overwintering adults lay eggs around 120 FDD after the biofix, with peak larvae and feeding occurring around 400 FDD. First generation feeding ends around 675 FDD. Second generation adults can cause severe damage, appearing around 900 FDD, peaking around 1400 FDD, and dispersing to overwintering habitats by around 1800 FDD.",
  photo: "colorado-potato-beetle.jpg",
  link: "https://vegento.russell.wisc.edu/pests/colorado-potato-beetle/"
)

corn_earworm = DegreeDayPest.create!(
  name: "Corn Earworm",
  remote_name: "dd_55_92",
  biofix_mm: 8, biofix_dd: 1,
  t_min: 55, t_max: 92,
  risk_start: 70, risk_peak: 275, risk_end: 440,
  info: "<p>The corn earworm (<i>Helicoverpa zea</i>) can cause serious economic damage to fresh market and processing sweet corn and hybrid dent seed corn. Also known as the tomato fruit worm, the larvae feed on field corn, tomatoes, lettuce, peppers, and snap beans.</p><p>Full-grown larvae of the corn earworm are olive-brown, tan, maroon, pink, or black with three or four dark stripes along their backs. The head is yellow and not spotted. They measure up to 2 inches long when mature. Adults are robust, grayish-brown moths with a wing-span of 1.5 inches. The front wings are marked with dark gray, irregular lines with a dark area near the wing tip. Eggs are tiny (1/32 inch), flattened spheres with prominent ridges. When deposited, the eggs are light yellow, but they darken to dusky brown before hatching.</p>",
  severity_info: "Adjust biofix to match date when first eggs or adults are observed. Corn earworm eggs typically hatch around 70 FDD after the biofix date. Peak larval populations and damage occur around 275 FDD, with larvae leaving corn ears and pupating around 440 FDD.",
  photo: "corn_earworm.jpg",
  link: "https://vegento.russell.wisc.edu/pests/corn-earworm/"
)

corn_rootworm = DegreeDayPest.create!(
  name: "Corn Rootworm",
  remote_name: "dd_52_none",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 52, t_max: nil,
  risk_start: 329, risk_peak: 472, risk_end: 636,
  info: "<p>Rootworm (genus <i>Diabrotica</i>) larvae are white with black heads and grow 1/2 inch long. Northern and western rootworm larvae cannot be differentiated in the field. They feed on crown roots from June to August, causing corn to lodge and “gooseneck.”</p><p>Rootworms are most serious in loam soils but are of little consequence in muck or non-irrigated sandy soils. The larvae are not a potential problem unless corn is planted on the same ground in a “rootworm area” for 2 or more years in succession. Annual crop rotation controls these insects, because eggs overwinter in the soil.</p>",
  severity_info: "First instar larvae appear around 329 FDD with light feeding expected. Larval populations peak around 472 FDD with heavy feeding expected. Larval stage expected to end by 636 FDD.",
  photo: "corn-rootworm.jpg",
  link: "https://vegento.russell.wisc.edu/pests/corn-rootworms/"
)

european_corn_borer = DegreeDayPest2.create!(
  name: "European Corn Borer",
  remote_name: "dd_50_86",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 50, t_max: 86,
  risk_start: 550, risk_peak: 740, risk_end: 900,
  risk_start2: 1660, risk_peak2: 1950, risk_end2: 2190,
  info: "<p>European corn borer (<i>Ostrinia nubilalis</i>) larvae are between 3/4 to 1 inch long and range in color from grey to creamy white, with a black head and numerous spots over the body. In most of Wisconsin, two generations of eggs are laid on the undersides of leaves. First generation larvae typically cause damage only to leaves and stalks, unless the corn is already tasseling, in which case the larvae will enter the ear. In Southern Wisconsin, begin checking early sweet corn for egg masses by June 15th. Second generation larvae develop from eggs laid in mid-August and cause heavy infestations in late-planted corn. Direct feeding on kernels may make sweet corn unmarketable.</p>",
  severity_info: "First generation adult flight expected starting 329 FDD, peaking 472 FDD, and ending 636 FDD. Second generation adult flight expected starting 1660 FDD, peaking 1950 FDD, and ending 2190 FDD.",
  photo: "european-corn-borer.jpg",
  link: "https://vegento.russell.wisc.edu/pests/european-corn-borer/"
)

flea_beetle_crucifer = DegreeDayPest2.create!(
  name: "Flea Beetle (Crucifer)",
  remote_name: "dd_50_none",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 50, t_max: nil,
  risk_start: 820, risk_peak: 965, risk_end: 1155,
  risk_start2: 1640, risk_peak2: 1785, risk_end2: 1975,
  info: "<p>Flea beetles (Tribe Alticini) are an early-season pest commonly found on all members of the cole crop group, as well as spinach, beets, potatoes, and eggplant.  There are several different species of flea beetle that pose problems early in the season when they are considered occasional pests. Host plants of many of the flea beetles are easily identified by their common names. For example, the crucifer flea beetle attacks cole crops and mustards while the eggplant flea beetle is commonly associated with eggplant.</p><p>Common Wisconsin flea beetles include the cruicfer, eggplant, horseradish, pale-striped, potato, spinach, and striped varieties. All have characteristically large hind legs that give adults the ability to jump. Adult flea beetles range in size from about 1/10 – 1/5 inch. Larvae are delicate and thread-like with white bodies and brown heads.</p><p>Adults feed on both leaf surfaces, but usually on the underside where they chew small, circular holes through to the upper cuticle. This cuticle often remains in place for some time before trying and falling out. The circular holes give the plant a “shot-gun” appearance. Heavy feeding on young plants may reduce yields or even kill plants in severe cases. Crops grown for their foliage such as kale, bok choy, spinach, or mustards may be rendered unmarketable by flea beetle damage. Larvae feed on the roots and tubers of susceptible plants but don’t often cause economic damage. Larvae of the horseradish flea beetle also mine the stem and leaf veins. In addition, many are vectors of plant pathogens.</p>",
  severity_info: "Adult flea beetles are most damaging with two generations typical in Wisconsin. First generation adults develop around 820 FDD and feed through around 1155 FDD. Second generation adults emerge around 1640 FDD and feed through around 1975 FDD.",
  photo: "flea-beetle.jpg",
  link: "https://vegento.russell.wisc.edu/pests/flea-beetles/"
)

flea_beetle_mint = DegreeDayPest.create!(
  name: "Flea Beetle (Mint)",
  remote_name: "dd_41_none",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 41, t_max: nil,
  risk_start: 550, risk_peak: 740, risk_end: 900,
  info: "<p>Flea beetles (Tribe Alticini) are an early-season pest commonly found on all members of the cole crop group, as well as spinach, beets, potatoes, and eggplant.  There are several different species of flea beetle that pose problems early in the season when they are considered occasional pests. Host plants of many of the flea beetles are easily identified by their common names. For example, the crucifer flea beetle attacks cole crops and mustards while the eggplant flea beetle is commonly associated with eggplant.</p><p>Common Wisconsin flea beetles include the cruicfer, eggplant, horseradish, pale-striped, potato, spinach, and striped varieties. All have characteristically large hind legs that give adults the ability to jump. Adult flea beetles range in size from about 1/10 – 1/5 inch. Larvae are delicate and thread-like with white bodies and brown heads.</p><p>Adults feed on both leaf surfaces, but usually on the underside where they chew small, circular holes through to the upper cuticle. This cuticle often remains in place for some time before trying and falling out. The circular holes give the plant a “shot-gun” appearance. Heavy feeding on young plants may reduce yields or even kill plants in severe cases. Crops grown for their foliage such as kale, bok choy, spinach, or mustards may be rendered unmarketable by flea beetle damage. Larvae feed on the roots and tubers of susceptible plants but don’t often cause economic damage. Larvae of the horseradish flea beetle also mine the stem and leaf veins. In addition, many are vectors of plant pathogens.</p>",
  severity_info: "Mint flea beetle adults emerge around 1475 FDD, with activity peaking around 1675 FDD and ending around 1880 FDD.",
  photo: "flea-beetle.jpg",
  link: "https://vegento.russell.wisc.edu/pests/flea-beetles/"
)

imported_cabbageworm = DegreeDayPest2.create!(
  name: "Imported Cabbageworm",
  remote_name: "dd_50_none",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 50, t_max: nil,
  risk_start: 150, risk_peak: 240, risk_end: 630,
  risk_start2: 830, risk_peak2: 1030, risk_end2: 2000,
  info: "<p>Imported cabbageworms (also known as cabbage whites or small whites), cabbage loopers and diamondback moths are the three most significant caterpillar pests of Wisconsin cole crops, with the imported cabbage worm being the most significant. Diamondback moths are worldwide pests of cabbage and leafy greens, and have developed resistance to numerous insecticides and several products containing Bacillus thuringiensis (Bt). The cabbage looper attacks beets, celery, lettuce, peas, potatoes, spinach and tomatoes, in addition to cole crops.</p><p>Imported cabbageworm adults, commonly referred to as the white cabbage butterfly, are white butterflies with black markings on the wing tips. Female butterflies have 2 black dots on each fore wing; males, which are smaller, have 1 dot per wing. Eggs are yellow and conical, laid individually on the leaf surface and occasionally on the stem. An adult butterfly can lay 300 to 400 eggs in her lifetime. Larvae appear as velvety green worms up to 1 inch long with a faint yellow stripe running down the back. The caterpillar is commonly found along the veins of leaves and easily blends into the foliage.</p><p>Imported cabbageworms overwinter as chrysalae on plant debris and usually produce 3-6 generations in a season. Butterflies emerge in early May and begin laying single, small, yellow-orange eggs on any plant part that is above ground. The eggs hatch in about 5 days. The larve develop on cruciferous weeds and cole crops that are early planted. The caterpillar feeds and develops for approximately 11 to 20 days before forming a pupa from which the adult butterfly emerges after 6 to 11 days. Second generation butterflies emerge mid-July and larvae develop almost entirely on cultivated cole crops. This generation causes the most damage.</p>",
  severity_info: "First generation adult flight starts around 150 FDD, peaks around 240 FDD, with larval feeding expected through 630 FDD. Second generation adult flight starts around 830 FDD, peaks around 1030 FDD, with larval feeding expected through around 2000 FDD.",
  photo: "imported-cabbageworm.jpg",
  link: "https://vegento.russell.wisc.edu/pests/caterpillar-pests-of-cole-crops/"
)

japanese_beetle = DegreeDayPest.create!(
  name: "Japanese Beetle",
  remote_name: "dd_50_none",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 50, t_max: nil,
  risk_start: 970, risk_peak: 1600, risk_end: 2150,
  info: "<p>Japanese beetle (<i>Popillia japonica</i>) adults are slightly less than 1∕2 inch long, and are shiny, metallic green. They have coppery-brown wing covers that do not entirely cover the abdomen. There are six pairs of patches of white hairs along the sides and back of the body, under the edges of the wings. Males and females have the same markings, but females are typically slightly larger. Newly hatched larvae are approximately 1∕8 inch long and a translucent, creamy white. Once feeding begins, the hindguts of larvae appears gray to black. The typical C-shape of Japanese beetle larvae is similar to that of other white grub species.</p><p>Japanese beetle adults do not damage turf, but are an important pest of many other plants. They feed on foliage or flowers, and are a major pest of over 350 species of plants, including fruits, vegetables, ornamentals, field and forage crops, and weeds. Norway and Japanese maple, birch, crabapple, purple-leaf plum, rose, mountain ash, and linden are highly preferred ornamental hosts. Adults feed on the upper surface of the foliage of most plants, consuming soft tissues (mesophyll) between the veins, and leaving a lace-like skeleton. Often the upper canopy is defoliated first or most severely. Trees with extensive feeding damage turn brown and become partially defoliated.</p><p>Japanese beetle grubs feed below ground and chew on the roots of turf and ornamentals. As a result, they reduce a plant’s ability to take up enough water and nutrients to withstand stresses of hot, dry weather. The first evidence of grub injury in turf is the development of localized-patches of pale, dying grass that displays symptoms of drought stress. As grubs develop further and feeding increases, damaged areas rapidly enlarge and coalesce (merge) to a point where the turf is not well-anchored and can be rolled back like carpet.</p>",
  severity_info: "Adults emerge starting around 970 FDD, with peak feeding around 1600 FDD, and end of feeding by around 2150 FDD.",
  photo: "japanese-beetle.jpg",
  link: "https://vegento.russell.wisc.edu/pests/japanese-beetle/"
)

lygus_bug = DegreeDayPest.create!(
  name: "Lygus Bug",
  remote_name: "dd_52_none",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 52, t_max: nil,
  risk_start: 275, risk_peak: 1000, risk_end: 2000,
  info: "<p>Tarnished plant bugs (<i>Lygus lineolaris</i>), also known as Lygus bugs, are 1/4 inch, tan to dark brown oval insects with piercing sucking mouthparts. They attack more than 50 different economic crops but are most damaging to strawberries, peppers, and all bean crops in Wisconsin. Feeding by these insects causes poor fruit set and gnarled fruit due to the toxic saliva they inject into the plant. They are highly mobile insects that overwinter in field debris. Large numbers of adult plant bugs migrate out of alfalfa fields when hay is cut. For both potatoes and commercial beans, take 25 sweeps with an insect sweep net per sample site with at least 10 sample sites per 100 acres. When counts exceed one tarnish plant bug per sweep on a field average, control measures are recommended in potato and snap bean.</p>",
  severity_info: "Lygus bugs are active most of the summer after early-season nymph development (starting 275 FDD).",
  photo: "tarnished-plant-bug.jpg",
  link: "https://vegento.russell.wisc.edu/pests/"
)

mint_root_borer = DegreeDayPest.create!(
  name: "Mint Root Borer",
  remote_name: "dd_50_none",
  biofix_mm: 4, biofix_dd: 1,
  t_min: 50, t_max: nil,
  risk_start: 430, risk_peak: 1280, risk_end: 2150,
  info: "<p>Fumibotys is a monotypic moth genus of the family Crambidae which was described by Eugene G. Munroe in 1976. Its single species, <i>Fumibotys fumalis</i>, the mint root borer moth, described by Achille Guenée in 1854, is found in most of North America. The wingspan is about 20 mm (0.79 in). The forewings are orangish to light brown with a large dark patch near the middle of the wing. Adults are on wing from June to August. Young larvae feed on the leaves of <i>Mentha</i> species, while older larvae feed on the roots and rhizomes of their host plant. Young larvae are 2-3 mm (0.079-0.118 in) long. They are yellow to light green with dark stripes. Older larvae reach a length of 19 mm (0.75 in). They have a yellow-tan body and a red-brown head. The species overwinters in the prepupal stage in the soil around the roots of their host. Pupation takes place in spring.</p>",
  severity_info: "First moth catch expected around 430 FDD, with peak egg hatch occurring around 1280 FDD. End of risk is approximately 2150 FDD when hibernaculum formation completes.",
  photo: "mint-root-borer.jpg",
  link: "https://en.wikipedia.org/wiki/Fumibotys"
)

onion_maggot = DegreeDayPest2.create!(
  name: "Onion Maggot",
  remote_name: 'dd_39p2_86',
  biofix_mm: 1, biofix_dd: 1,
  t_min: 39.2, t_max: 86,
  risk_start: 510, risk_peak: 680, risk_end: 850,
  risk_start2: 1460, risk_peak2: 1950, risk_end2: 2435,
  info: "<p>Onion maggots (<i>Delia antiqua</i>) are tiny maggots that feed below ground on onion bulbs, making tunnels in the bulbs and potentially allowing disease organisms to enter. These maggots are often the most serious pests of onions, especially where continuous production is practiced. Onion maggots are highly host-specific to plants in the onion family, including onions, leeks, shallots, garlic, and chives.</p><p>Onion maggot adults are about 1/3-inch long and resemble small houseflies. Larvae taper to a point at the head and are only ¼-inch long. Their wings overlap with their bodies while at rest. Adults lay white, elongated eggs at the base of the onion plant. Cream-colored onion maggot larvae develop over the course of 3 stages that last a total of 2-3 weeks.</p><p>Larvae feed on the hypocotyl (below ground) tissue of seedlings, resulting in various types of damage. Damage appears as wilted and yellowed foliage, followed by collapsed leaves. Leaves can become rotten, and plants may die. Onion plants are most vulnerable during the seedling stage, and larval feeding may kill seedlings. Poor plant stands may indicate an onion maggot problem. Onion maggots can cause damage throughout the season, although they are often an early season pest during stand establishment. At the end of the season, maggot feeding can lead to storage rots. Onion types differ in susceptibility to onion maggot damage, with set onions most susceptible, followed by white varieties, yellow varieties, and finally red varieties which are least susceptible.</p>",
  severity_info: "First generation adult flight peaks around 680 FDD and second generation adult flight peaks around 1950. Controlling adults is the best way to protect against damage from this pest.",
  photo: "onion-maggot.jpg",
  link: "https://vegento.russell.wisc.edu/pests/onion-maggot/"
)

seedcorn_maggot = SeedcornMaggot.create!(
  name: "Seedcorn Maggot",
  remote_name: "dd_39p2_86",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 39.2, t_max: 86,
  risk_start: 295, risk_peak: 360, risk_end: 425,
  risk_start2: 1015, risk_peak2: 1080, risk_end2: 1145,
  info: "<p>The seedcorn maggot (<i>Delia platura</i>) is a perennial pest of the germinating seeds and young seedlings of a wide range of vegetable and agronomic crops. In addition to corn, seedcorn maggots (SCM) has a large host range including numerous common vegetable crops. SCM can cause economic damage to seeds of artichoke, beet, Brussels sprouts, cabbage, cantaloupe, carrot, cauliflower, cucumber, kale, lettuce, bean (lima, snap, red), onion, pea, pumpkin, tomato, and turnip. In high numbers SCM can decimate entire crop stands if left untreated. SCM can be an increasing problem when susceptible crop crops are planted in succession.</p><p>Larvae are typical of many other fly maggots: 7 mm when fully grown, cream–colored, legless, and wedge-shaped. The head of the maggot is sharply pointed. SCM pupae are dark brown, 5 mm long, cylindrical in shape, and evenly rounded on both ends. SCM spends between 7-14 days in the pupal stage at normal summer time temperatures (~70°F). Adult flies resemble miniature houseflies. They are dark gray with black legs, 4-5 mm long and commonly hold their opaque wings flat over their abdomen when at rest.</p>Seed corn maggots overwinter as pupae in the soil. Adult flies begin emerging in the late spring, peak emergence for the first generation occurs in early to mid-May. Adult SCM often swarm over recently tilled fields or gardens. Preferred egg deposition sites are locations with germinating or decaying seeds, plant residue, incorporated green manures or where organic fertilizers have been recently applied. Adults often mate and lay eggs within 2-3 days of emergence. Eggs hatch 2-4 days later depending on soil temperature. The larval portion of the SCM life cycle occurs below ground over the course of a few weeks. Once hatched larvae burrow into the soil 6-8 cm to locate food resources. A complete life cycle for SCM can range from 15-77 days, in a typical season 16-21 days is sufficient. In Wisconsin, there are typically 3-5 generations per year.</p>",
  severity_info: "In Wisconsin there are typically 3-5 generations per year, with maximum risk coinciding with peak adult flight times: First (overwintering) generation flight peaks around 360 FDD, second generation flight peaks around 1080 FDD, third generation peaks around 1800 FDD, fourth generation peaks around 2520 FDD, and the fifth generation peaks around 3240.",
  photo: "seedcorn-maggot.jpg",
  link: "https://vegento.russell.wisc.edu/pests/seedcorn-maggot/"
)

squash_vine_borer = DegreeDayPest.create!(
  name: "Squash Vine Borer",
  remote_name: "dd_50_none",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 50, t_max: nil,
  risk_start: 750, risk_peak: 900, risk_end: 1000,
  info: "<p>The squash vine borer (<i>Melittia cucurbitae</i>) is a sporadic pest of pumpkin and squash (e.g. cucurbits). Activity of adult moths and larvae often occurs as the crop is expanding rapidly from late June until the first of August. Resulting damage can be difficult to diagnose prior to significant harm to the plant occurs. In years of heavy infestation squash vine borer can become a significant economic pest in some cucurbit crops.</p><p>Susceptibility to squash vine borer is variable among species of cucurbits. Varieties known to be suitable hosts are pumpkins and squashes. Commonly infested cultivars are pumpkin (standard and giant), zucchini, as well as crookneck, straight neck, acorn, patty pan, summer, banana, buttercup, and hubbard squashes.</p><p>The damage caused by squash vine borer larvae is often difficult to detect until the plant wilts and dies in late July and August. Initial signs of infestation are very difficult to detect. Scouting early often involves searching for entrance holes and frass at the base of vine crop stems. Advanced symptoms of squash vine borer infestation are quickly wilting plants in the heat of the day. Since wilting may be confused with other pests of vine crops (e.g. bacterial or <i>Fusarium</i> wilts) scouting remains critical. Plants that infested plants may be diagnosed by splitting the base stems of the plant to confirm the presence of the larvae. Fields that have been damaged in past seasons have a good chance for recurring squash vine borer infestations annually.</p>",
  severity_info: "Adult emergence begins around 750 FDD, peaking around 900 FDD, and ending around 1000 FDD.",
  photo: "squash-vine-borer.jpg",
  link: "https://vegento.russell.wisc.edu/pests/squash-vine-borer/"
)

stalk_borer = DegreeDayPest.create!(
  name: "Stalk Borer",
  remote_name: "dd_41_86",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 41, t_max: 86,
  risk_start: 1110, risk_peak: 1400, risk_end: 1700,
  info: "<p>Eggs of the common stalk borer (<i>Paipanema nebris</i>), a cutworm relative, are laid in grassy weeds in September. In late May to July, the brown-and-white striped caterpillars migrate into fields and burrow into the stems of tomatoes, potatoes, beans, and other thick-stemmed plants. Once inside the stem, the insect cannot be controlled. Fall grass control will prevent egg laying and is the best control method for common stalk borer.</p>",
  severity_info: "Adult flight begins around 1110 FDD and peaks around 1650 FDD. Control is best between 1400 and 1700 FDD.",
  photo: "common-stalk-borer.jpg",
  link: "https://vegento.russell.wisc.edu/pests/"
)

variegated_cutworm = DegreeDayPest.create!(
  name: "Variegated Cutworm",
  remote_name: "dd_41_88",
  biofix_mm: 5, biofix_dd: 1,
  t_min: 41, t_max: 88,
  risk_start: 900, risk_peak: 1450, risk_end: 2100,
  info: "<p>These are the larval stage (caterpillar) of night-flying moths. They are whitish gray to brown worms, ranging from 1/2 to 2 inches long. They feed almost exclusively at night and hide in the soil during the day. All cutworms curl to a characteristic tight ball when exposed, making them easy to identify. Most cutworms cut plants off at or slightly below the soil surface, making recent transplants especially susceptible. Eventually, plants become too thick and tough for cutworms to feed. Adult females are attracted to tall grasses for egg laying, and cutworm numbers tend to be higher in weedy or trashy fields.</p><p>Almost all commercial vegetable crops such as asparagus, beets, onions, carrots, celery, and potatoes can be attacked by cutworms. It is very difficult to predict when and where an infestation will spring up, and pre-plant insecticide treatments will not control heavy cutworm infestations. Scouting fields on a weekly basis is the best method for monitoring cutworm activity. If damaging populations are found, a “rescue” treatment will be needed. Bait formulations are the preferred treatment if conditions are dry, whereas both baits and sprays can be used when the cutworms are feeding at the soil surface.</p>",
  severity_info: "Egg-laying peaks around 900 FDD with larval populations active from around 1150 FDD through 1900 FDD, with end of larval stage around 2100 FDD.",
  photo: "cutworm-larvae.jpg",
  link: "https://vegento.russell.wisc.edu/pests/black-cutworm/"
)

western_bean_cutworm = DegreeDayPest.create!(
  name: "Western Bean Cutworm",
  remote_name: "dd_50_none",
  biofix_mm: 5, biofix_dd: 1,
  t_min: 50, t_max: nil,
  risk_start: 1320, risk_peak: 1420, risk_end: 1535,
  info: "<p>These are the larval stage (caterpillar) of night-flying moths. They are whitish gray to brown worms, ranging from 1/2 to 2 inches long. They feed almost exclusively at night and hide in the soil during the day. All cutworms curl to a characteristic tight ball when exposed, making them easy to identify. Most cutworms cut plants off at or slightly below the soil surface, making recent transplants especially susceptible. Eventually, plants become too thick and tough for cutworms to feed. Adult females are attracted to tall grasses for egg laying, and cutworm numbers tend to be higher in weedy or trashy fields.</p><p>Almost all commercial vegetable crops such as asparagus, beets, onions, carrots, celery, and potatoes can be attacked by cutworms. It is very difficult to predict when and where an infestation will spring up, and pre-plant insecticide treatments will not control heavy cutworm infestations. Scouting fields on a weekly basis is the best method for monitoring cutworm activity. If damaging populations are found, a “rescue” treatment will be needed. Bait formulations are the preferred treatment if conditions are dry, whereas both baits and sprays can be used when the cutworms are feeding at the soil surface.</p>",
  photo: "cutworm-larvae.jpg",
  severity_info: "25% adult moth emergence expected around 1320 FDD, peaking around 1420 FDD, and ending around 1535 FDD.",
  link: "https://vegento.russell.wisc.edu/pests/black-cutworm/"
)

western_flower_thrips = Thrips.create!(
  name: "Western Flower Thrips",
  remote_name: "dd_45_none",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 45, t_max: nil,
  risk_start: 340, risk_peak: 675, risk_end: 1010,
  risk_start2: 1010, risk_peak2: 1350, risk_end2: 1685,
  info: "<p>Thrips are small 1/25-inch insects that cause whitish scratches or brownish blotches on plant leaves. Hot dry weather is correlated with severe thrips problems. Thrips attack cabbage and cause a brownish scarring in the head of processing cabbage. Thrips must be controlled before the plant heads out in order to assure proper coverage and control. In onions the injury looks similar to both ozone injury and some diseases. Use large volumes sprays (100 gallons/acre) with a wetting agent for thrips control. A second treatment 5 to 7 days later may be warranted.</p>",
  severity_info: "Thrips typically have several overlapping generations per year in Wisconsin, with peaks occurring around 675, 1350, 2025, and 2700 FDD.",
  photo: "thrips.png",
  link: "https://vegento.russell.wisc.edu/pests/onion-thrips/"
)

aphid_pvy = DegreeDayPest.create!(
  name: "Aphid PVY Vectors",
  remote_name: "dd_39p2_86",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 39.2, t_max: 86,
  risk_start: 1967, risk_peak: 2473, risk_end: 3228,
  info: "<p>Of principal interest to potato seed growers in Wisconsin is the prevention of PVY in seed potato lots. PVY is transmitted by aphid feeding activity and can be prevented in part by the timely application of crop oils, which discourage aphids from probing leaf tissues in search of their preferred host and inadvertently transmitting the virus.</p><p>The Upper Midwest Aphid Suction Trap Network, developed and maintained out of the University of Illinois at Urbana-Champaign, has been in operation since 2005. Originally conceived to detect soybean aphid flights and provide timely information to growers, the wealth of data now available after 14 years of operation has enabled us to model flight patterns for a number of different species captured by these traps. These predictive models can also be aligned to degree-days rather than calendar days to control for site-to-site and annual climatic variations.</p><p>We have taken these species-specific models and incorporated published PVY transmission efficiency values to compute risk-adjusted counts for each species. These counts are then added, and a single model is generated from this aggregate risk value that indicates the PVY risk window in Wisconsin.</p>",
  severity_info: "The risk of PVY transmission by aphid vectors begins around 1967 FDD, peaks around 2473 FDD, and ends around 3228 FDD. PVY transmission risk is calculated from a combination of several aphid species, the relative abundance of each species in Wisconsin, and the estimated PVY transmission efficiency of each species. Aphid vectors include Soybean aphid, Bird cherry-oat aphid, Green peach aphid, Pea aphid, Corn leaf aphid, and Potato aphid.",
  photo: "pea-aphid.jpg",
  link: "https://vegento.russell.wisc.edu/pests/aphids/"
)

oak_wilt = DegreeDayPest.create!(
  name: "Oak Wilt vectors",
  remote_name: "dd_41_none",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 41, t_max: nil,
  risk_start: 128, risk_peak: 507, risk_end: 1207,
  info: "Oak Wilt is a lethal disease caused by the invasive fungus <i>Bretziella fagacearum</i>, which is transmitted aboveground by sap beetles (Family Nitidulidae). Two major sap beetle vectors of Oak Wilt in Wisconsin are <i>Colopterus truncatus</i> and <i>Carpophilus sayi</i>, whose combined abundance and thus risk of transmitting Oak Wilt can be modeled using a degree-day model with base temperature 41 degrees Fahrenheit.</p><p>Oak Wilt transmission risk begins at 128 FDD, peaks around 507 FDD, and continues through either 1207 FDD or Jul 15, whichever is later. Wounding/pruning/harvesting oaks should be avoided during this period of elevated transmission risk. If an oak is wounded, consider applying wound dressing immediately to wounds and the last three growth rings of cut stumps. Though not scientifically proven, herbicide application to stumps is believed to make the stump less suitable for pathogen infection. <b>Forest setting:</b> if your stand is in a county that has oak wilt OR within 6 miles of a county with oak wilt, any activities that may wound oaks should only be considered under certain conditions.</p>",
  severity_info: "Oak Wilt transmission risk begins at 128 FDD, peaks around 507 FDD, and continues through either 1207 FDD or Jul 15, whichever is later. Wounding/pruning/harvesting oaks should be avoided during this period of elevated transmission risk. If an oak is wounded, consider applying wound dressing immediately to wounds and the last three growth rings of cut stumps.",
  photo: "oak_wilt.png",
  link: "https://agweather.cals.wisc.edu/thermal_models/oak_wilt"
)


## Crop filters ##
alfalfa = Crop.create!(name: "Alfalfa")
alfalfa.pests = [alfalfa_weevil]

asparagus = Crop.create!(name: "Asparagus")
asparagus.pests = [asparagus_beetle, black_cutworm, western_bean_cutworm, variegated_cutworm, japanese_beetle]

bean = Crop.create!(name: "Bean")
bean.pests = [corn_earworm, black_cutworm, western_bean_cutworm, variegated_cutworm, european_corn_borer, japanese_beetle, seedcorn_maggot]

beet = Crop.create!(name: "Beet")
beet.pests = [cercospora_leaf_spot, black_cutworm, western_bean_cutworm, variegated_cutworm, japanese_beetle]

carrot = Crop.create!(name: "Carrot")
carrot.pests = [foliar_disease, black_cutworm, western_bean_cutworm, variegated_cutworm]

celery = Crop.create!(name: "Celery")
celery.pests = [cabbage_looper, black_cutworm, western_bean_cutworm, variegated_cutworm, lygus_bug]

cole = Crop.create!(name: "Cole Crops")
cole.pests = [cabbage_looper, flea_beetle_crucifer, imported_cabbageworm, japanese_beetle, cabbage_maggot]

corn = Crop.create!(name: "Corn (Field and Sweet)")
corn.pests = [stink_bug, corn_earworm, corn_rootworm, black_cutworm, western_bean_cutworm, variegated_cutworm, european_corn_borer, seedcorn_maggot, stalk_borer]

cucumber = Crop.create!(name: "Cucumber")
cucumber.pests = [black_cutworm, western_bean_cutworm, variegated_cutworm, seedcorn_maggot, squash_vine_borer]

eggplant = Crop.create!(name: "Eggplant")
eggplant.pests = [colorado_potato_beetle, european_corn_borer, japanese_beetle]

hops = Crop.create!(name: "Hops")
hops.pests = [cabbage_looper, black_cutworm, western_bean_cutworm, variegated_cutworm, japanese_beetle]

horseradish = Crop.create!(name: "Horseradish")
horseradish.pests = [japanese_beetle]

leafy_greens = Crop.create!(name: "Leafy Greens")
leafy_greens.pests = [cabbage_looper, variegated_cutworm, japanese_beetle, lygus_bug]

melon = Crop.create!(name: "Melon")
melon.pests = [cabbage_looper, black_cutworm, western_bean_cutworm, variegated_cutworm, japanese_beetle, seedcorn_maggot, squash_vine_borer]

mint = Crop.create!(name: "Mint")
mint.pests = [cabbage_looper, black_cutworm, western_bean_cutworm, variegated_cutworm, flea_beetle_mint,  japanese_beetle, mint_root_borer]

onion = Crop.create!(name: "Onion")
onion.pests = [onion_maggot]

pea = Crop.create!(name: "Pea")
pea.pests = [cabbage_looper, black_cutworm, japanese_beetle]

pepper = Crop.create!(name: "Pepper")
pepper.pests = [european_corn_borer, japanese_beetle]

potato = Crop.create!(name: "Potato")
potato.pests = [early_blight, late_blight, cabbage_looper, colorado_potato_beetle, black_cutworm, western_bean_cutworm, variegated_cutworm, european_corn_borer, japanese_beetle, lygus_bug, aphid_pvy]

pumpkin_squash = Crop.create!(name: "Pumpkin and Squash")
pumpkin_squash.pests = [japanese_beetle, seedcorn_maggot, squash_vine_borer]

tomato = Crop.create!(name: "Tomato")
tomato.pests = [early_blight, late_blight, cabbage_looper, colorado_potato_beetle, black_cutworm, western_bean_cutworm, variegated_cutworm, japanese_beetle]
