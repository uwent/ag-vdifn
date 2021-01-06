# Foliar diseases
late_blight = LateBlight.create!(
  name: "Late Blight",
  remote_name: "potato_blight_dsv",
  biofix_mm: 1, biofix_dd: 1,
  critical_value: 0,
  info: "<p><u><b>Late blight</b></u>: Phytophthora infestans infects all aboveground plant parts and potato tubers and can be transmitted via seed, culls, volunteers, and weeds (i.e., nightshade). Foliar infections begin with watersoaking and progress quickly to cause tan/brown dead tissue. Brown cankers can girdle petioles and stems. White, downy sporulation is often visible, with high humidity, on undersides of leaves along lesion edges. Infected tomato fruits remain firm underneath mottled-looking brown areas. Infected tubers appear as brown decay on the surface and into the top ¼-inch of tissue. Late blight disease advances quickly under conditions of high humidity (≥90%) and cool temperatures (50-70°F). Prevention is critical for control. Eliminate culls and volunteer plants. Avoid prolonged wetness on leaves and canopy, use certified seed, and follow DSV accumulation values that prompt early, preventative fungicide applications. If disease is present, treat with appropriate fungicides on a 5-7 day spray interval.</p>",
  severity_info: "More information on pest severity",
  link: "https://vegpath.plantpath.wisc.edu/")

foliar_disease = FoliarDisease.create!(
  name: "Foliar Disease",
  remote_name: "carrot_foliar_dsv",
  biofix_mm: 1, biofix_dd: 1,
  critical_value: 0,
  info: "<p><u><b>Alternaria leaf blight</b></u>: the seedborne Alternaria fungus causes dark-brown lesions on leaflets and petioles that weaken and/or kill carrot foliage, causing separation from root crowns during mechanical harvest.</p><p>Disease management includes using certified or heat-treated seed, crop rotation, in- furrow irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.</p><p><u><b>Cercospora leaf blight</b></u>: the potentially seedborne Cercospora fungus causes tan lesions with a darker brown margin on carrot leaflets and petioles. Plant growth can be reduced from dead, curled leaflets and, in severe cases, death of the entire canopy.</p><p>Disease management includes using certified or pre-treated seed, crop rotation, avoiding overhead irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.</p>",
  severity_info: "More information on pest severity",
  link: "https://vegpath.plantpath.wisc.edu/")

# Insect models
alfalfa_weevil = DegreeDayPest.create!(
  name: "Alfalfa Weevil",
  remote_name: 'alfalfa_weevil',
  biofix_mm: 1, biofix_dd: 1,
  t_min: 48, t_max: nil,
  critical_value: 371,
  info: "<p><strong><i>Hypera postica</i></strong>, commonly known as the alfalfa weevil, is a species of beetle in the superfamily Curculionoidea; it can be found in alfalfa fields throughout Europe and North America. Considered a destructive threat to alfalfa production in North America, several accidental introductions have been successfully countered though the use of a variety of biological control species.</p><p>The alfalfa weevil grows to a length of about 4 to 5.5 mm (0.16 to 0.22 in). The rostrum or beak is short and broad. The frons is half as wide as the rostrum while the pronotum is broadest in the centre. The general colour of the insect is brown, with a dark mid-dorsal stripe. The larva has a distinctive black head and no legs; it is yellowish-green, with a white dorsal stripe and faint white lateral stripes. It is about 1 cm (0.4 in) long just before pupation. It pupates in a white, pea-sized cocoon made of loosely-woven silk. It resembles the clover leaf weevil (<i>Hypera punctata</i>), but that species is nearly twice as large, the larvae have tan heads and they seldom cause much damage to alfalfa crops.</p><p>In the midwest, some eggs are laid in the late fall or the winter, when weather conditions permit. Adults also overwinter and become increasingly active in March and April. Eggs are laid in batches of up to 25 inside alfalfa stems. The larvae feed for three or four weeks, moulting three times, before pupating in the cocoons they make. They emerge as adults in about one or two weeks. After feeding for a week or two, they may experience aestivation during the remainder of the summer, in which they demonstrate a dampening of their metabolic, respiratory and nervous system activities. In fall, the adults hide in the crowns of alfalfa plants or move onto coarse vegetation in ditches or by fences or in nearby woodland.</p>",
  severity_info: "Alfalfa weevil egg hatch begins around 300 FDD. Light feeding damage expected during 1st and 2nd instar life stages (350-500 FDD). Heavy feeding damage expected during 3rd and 4th instar development, approx. 400-600 FDD.",
  link: "https://en.wikipedia.org/wiki/Hypera_postica")

asparagus_beetle = DegreeDayPest.create!(
  name: "Asparagus Beetle (Common)",
  remote_name: "asparagus_beetle",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 50, t_max: 86,
  critical_value: 105,
  info: "<p>The common (<i>Crioceris asparagi</i>) and spotted (<i>Crioceris duodecimpunctata</i>) asparagus beetles are annual pests of asparagus in Wisconsin. The common asparagus beetle is the most prevalent and the only one that causes economic damage to asparagus.</p><p>Adults of the common asparagus beetle feed on the plant’s spears and ferns. Disfigured and unmarketable spears can result when the beetles feed or lay eggs on the spears. Spotted asparagus beetle larvae feed more on the berries rather than the ferns of asparagus.  Larvae secrete a black fluid onto the plants. Spring spear feeding reduces crop quality (browning, scarring, staining, and bent growth).  Summer fern feeding can cause defoliation and reduces yield of subsequent years.  Eggs laid on spears are unattractive to consumers, though harmless. Large populations of asparagus beetles, if left unchecked, can defoliate the plants.</p><p>Asparagus beetle overwinters in plant debris and brush as an adult.  Adults become active in spring when new spears emerge. The spotted asparagus beetle becomes active later in spring than the common asparagus beetle. Common asparagus beetles lay eggs on spears while spotted asparagus beetles lay eggs on ferns. About a week later eggs hatch. The larvae feed for about two weeks on asparagus and then pupate in the soil. About one week later the next generation of adults hatch.  Two to three generations occur in a growing season. Most larvae and adults are more active in the afternoon when the temperature and sunlight are at their peak.</p>",
  severity_info: "Egg hatch begins around 105 FDD, with peak larvae around 250 FDD and last larvae around 405 FDD. Peak adults around 570 FDD.",
  photo: "asparagus-beetle-common.jpg",
  link: "https://vegento.russell.wisc.edu/pests/asparagus-beetle/")

black_cutworm = DegreeDayPest.create!(
  name: "Black Cutworm",
  remote_name: "black_cutworm",
  biofix_mm: 5, biofix_dd: 15,
  t_min: 50, t_max: 86,
  critical_value: 400,
  info: "<p>Black cutworm larvae feed on newly emerged vegetable crops. The worms are active feeders, clipping many seedlings at or below the soil line in a single night. They prefer crops sown as seed (rather than transplants); susceptible crops include beets, carrots, cucumber, leafy greens, melons, peas, potato, pumpkin, snap beans, squash, and sweet corn. If not controlled, these pests can destroy approximately a third of planting. Black cutworms are particularly problematic to fresh market growers and home gardeners. As an adult moth, the black cutworm may be referred to as the Dark sword-grass or the Ipsilon dart.</p><p>The dark gray to black larvae have a greasy appearance and a grainy texture. Mature larvae grow to 1 ½ inches long. When disturbed, cutworms curl up into a tight C-shape. Adults are gray moths that have a series of distinctive dark markings on their forewings (including a dagger-shape on each outer forewing) and lighter colored hind wings.</p><p>The black cutworm doesn’t overwinter in Wisconsin. Instead, the adult moth migrates north on storm fronts in early spring, usually in May and early June. Females lay eggs on low-growing vegetation such as chickweed, curly dock, cruciferous weeds, and plant residue. Larvae hatch about 5-10 days later and over the course of a month will pass through six instars (growth stages) before pupating. Larvae migrate from mature vegetation to seedlings when they’re about ¾ inches long. About 2 weeks after entering the pupal stage, adult moths emerge, mate, and repeat the cycle. In Wisconsin, three generations emerge each year.</p>",
  severity_info: "Egg hatch begins around 180 FDD, with leaf cutting and larval development starting around 300 FDD and extending through 1000 FDD.",
  photo: "cutworm-larvae.jpg",
  link: "https://vegento.russell.wisc.edu/pests/black-cutworm/")

stink_bug = DegreeDayPest.create!(
  name: "Brown Marmorated Stink Bug",
  remote_name: "brown_marmorated_stink_bug",
  biofix_mm: 1, biofix_dd: 1,
  t_min: 54, t_max: 92,
  critical_value: 1608,
  info: "<p>Adult brown marmorated stink bugs are approximately 1.7 cm (0.67 in) long and about as wide, forming the heraldic shield shape characteristic of bugs in the superfamily Pentatomoidea. They are generally a dark brown when viewed from above, with a creamy white-brown underside. Individual coloration may vary, with some bugs being various shades of red, grey, light brown, copper, or black. The term 'marmorated' means variegated or veined, like marble, which refers to the markings unique to this species, includes alternating light-colored bands on the antennae and alternating dark bands on the thin outer edge of the abdomen. The legs are brown with faint white mottling or banding.</p><p>The nymph stages are black or very dark brown, with red integument between the sclerites. First instar nymphs have no white markings, but second through fifth instar nymphs have black antennae with a single white band. The legs of nymphs are black with varying amounts of white banding. Freshly molted individuals of all stages are pale white with red markings. Eggs are normally laid on the underside of leaves in masses of 28 eggs, and are light green when laid, gradually turning white.</p><p>Like all stink bugs, the glands that produce the defensive chemicals (the 'stink') are located on the underside of the thorax, between the first and second pair of legs.</p>",
  severity_info: "First generation adults typically develop by around 1608 FDD. Adult feeding is most damaging. Only one generation per year is typical in Wisconsin.",
  link: "https://en.wikipedia.org/wiki/Brown_marmorated_stink_bug")

# needs work
cabbage_looper = CabbageLooper.create!(
  name: "Cabbage Looper",
  remote_name: "cabbage_looper",
  biofix_mm: 5, biofix_dd: 15,
  t_min: 50, t_max: 90,
  critical_value: 325,
  info: "<p>The cabbage looper (<i>Trichoplusia ni</i>) is a medium-sized moth in the family Noctuidae, a family commonly referred to as owlet moths. Its common name comes from its preferred host plants and distinctive crawling behavior. Cruciferous vegetables, such as cabbage, bok choy, and broccoli, are its main host plant; hence, the reference to cabbage in its common name. The larva is called a looper because it arches its back into a loop when it crawls.</p><p>While crucifers are preferred, over 160 plants can serve as hosts for the cabbage looper larvae. The adult cabbage looper is a migratory moth that can be found across North America and Eurasia, as far south as Florida and as far north as British Columbia. Its migratory behavior and wide range of host plants contribute to its broad distribution.</p><p>The cabbage looper larva is a minor vegetable pest, especially for crucifers. While it is not significantly destructive, it is becoming difficult to manage due to its broad distribution and resistance to many insecticides. Numerous methods are being researched in order to control this species.</p>",
  photo: "cabbage-looper.jpg",
  severity_info: "The first small larvae appear around 325 FDD after the May 15 biofix date. Feeding continues and worsens as larvae grow, peaking around 520 FDD and ending around 750 FDD. Second generation larvae may begin appearing around 1115 FDD, peak around 1310 FDD, and end around 1540 FDD.",
  link: "https://vegento.russell.wisc.edu/pests/caterpillar-pests-of-cole-crops/")

# needs work
cabbage_maggot = DegreeDayPest.create!(
  name: 'Cabbage Maggot',
  remote_name: 'cabbage_maggot',
  biofix_mm: 1, biofix_dd: 1,
  t_min: 42.8, t_max: 86,
  critical_value: 360,
  info: "The adult cabbage maggot <i>(Delia radicum)</i> is a small gray fly that lays its eggs at the base of crop plants in the cabbage family. The small, cylindrical white eggs hatch into legless white maggots that feed on the roots. Seedling plants can be killed rapidly, while transplants tend to wilt and die slowly. Root crucifers such as radish and turnip show surface tunneling that is often accompanied by soft rots.<br />",
  severity_info: 'More information on pest severity',
  photo: 'cabbage-maggot.jpg',
  link: 'labs.russell.wisc.edu/vegento/pests/cabbage-maggot')

colorado_potato_beetle = DegreeDayPest.create!(name: 'Colorado Potato Beetle',
                              remote_name: 'colorado_potato_beetle',
                              info: "The Colorado potato beetle <i>(Leptinotarsa decemlineata)</i> is the most distinctive pest of potatoes. Both the yellow-and-black striped adults and the brick-red humped larvae feed on the foliage. Feeding normally is initiated on the terminal growth and can be severe. Adults overwinter and move to emerging potatoes early in the spring (May). The adults lay bright yellow egg masses, and larvae feed for several weeks in the summer before pupating in the soil. Emerging adults then continue feeding throughout the season until no vines remain.<br />",
                              biofix_mm: 5, biofix_dd: 1,
                              critical_value: 185,
                              t_min: 52,
                              t_max: nil,
                              photo: 'colorado-potato-beetle.jpg',
                              severity_info: 'More information on pest severity',
                              link: 'labs.russell.wisc.edu/vegento/pests/colorado-potato-beetle')

corn_earworm = DegreeDayPest.create!(name: "Corn Earworm",
                         remote_name: 'corn_earworm',
                         info: "Corn earworm <i>(Helicoverpa zea)</i> caterpillars are varicolored, smooth, up to 2 inches long and feed mostly on ear tips. Insecticide treatment is necessary for early market sweet corn and for late-season canning or market sweet corn (silking after August 15).<br />",
                         biofix_mm: 8, biofix_dd: 1,
                         critical_value: 73,
                         t_min: 55,
                         t_max: 92,
                         photo: 'corn_earworm.jpg',
                         severity_info: 'More information on pest severity',
                         link: 'labs.russell.wisc.edu/vegento/pests/corn-earworm')

corn_rootworm = CornRootworm.create!(name: "Corn Rootworm",
                             remote_name: 'corn_rootworm',
                             info: "Rootworm <i>(genus Diabrotica)</i> larvae are white with black heads and grow 1/2 inch long. Northern and western rootworm larvae cannot be differentiated in the field. They feed on crown roots from June to August, causing corn to lodge and “gooseneck.”<br/><br />Rootworms are most serious in loam soils but are of little consequence in muck or non-irrigated sandy soils. The larvae are not a potential problem unless corn is planted on the same ground in a “rootworm area” for 2 or more years in succession. Annual crop rotation controls these insects, because eggs overwinter in the soil.<br />",
                             biofix_mm: 1, biofix_dd: 1,
                             critical_value: 329,
                             t_min: 52,
                             t_max: nil,
                             photo: 'corn-rootworm.jpg',
                             severity_info: 'More information on pest severity',
                             link: 'labs.russell.wisc.edu/vegento/pests/corn-rootworms')

european_corn_borer = DegreeDayPest.create!(name: "European Corn Borer",
                                   remote_name: 'european_corn_borer',
                                   info: "European corn borer <i>(Ostrinia nubilalis)</i> larvae are between 3/4 to 1 inch long and range in color from grey to creamy white, with a black head and numerous spots over the body. In most of Wisconsin, two generations of eggs are laid on the undersides of leaves. First generation larvae typically cause damage only to leaves and stalks, unless the corn is already tasseling, in which case the larvae will enter the ear. In Southern Wisconsin, begin checking early sweet corn for egg masses by June 15th. Second generation larvae develop from eggs laid in mid-August and cause heavy infestations in late-planted corn. Direct feeding on kernels may make sweet corn unmarketable.<br />",
                                   biofix_mm: 1, biofix_dd: 1,
                                   critical_value: 690,
                                   t_min: 50,
                                   t_max: 86,
                                   photo: 'european-corn-borer.jpg',
                                   severity_info: 'More information on pest severity',
                                   link: 'labs.russell.wisc.edu/vegento/pests/european-corn-borer')

flea_beetle_mint = DegreeDayPest.create!(name: "Flea Beetle (Mint)",
                                remote_name: 'flea_beetle_mint',
                                info: "Flea beetles <i>(Tribe Alticini)</i> are frequently a pest of early plantings. These small, shiny black beetles, which jump when approached, chew small circular holes in the leaves. This damage is insignificant on large potatoes and tomatoes but young seedlings can be rapidly killed.Young seedlings or transplants of cabbage, broccoli, beet, tomato, eggplant, and all vine crops should be scouted on a weekly basis when they are young. If flea beetle activity is seen, an insecticide rescue treatment will be needed.<br />",
                                biofix_mm: 1,
                                biofix_dd: 1,
                                critical_value: 1475,
                                t_min: 41,
                                t_max: 103,
                                photo: 'flea-beetle.jpg',
                                severity_info: 'More information on pest severity',
                                link: 'labs.russell.wisc.edu/vegento/pests/flea-beetles')

flea_beetle_crucifer = DegreeDayPest.create!(name: "Flea Beetle (Crucifer)",
                                    remote_name: 'flea_beetle_crucifer',
                                    info: "Flea beetles <i>(Tribe Alticini)</i> are frequently a pest of early plantings. These small, shiny black beetles, which jump when approached, chew small circular holes in the leaves. This damage is insignificant on large potatoes and tomatoes but young seedlings can be rapidly killed.Young seedlings or transplants of cabbage, broccoli, beet, tomato, eggplant, and all vine crops should be scouted on a weekly basis when they are young. If flea beetle activity is seen, an insecticide rescue treatment will be needed.<br />",
                                    biofix_mm: 1,
                                    biofix_dd: 1,
                                    critical_value: 821,
                                    t_min: 50,
                                    t_max: nil,
                                    photo: 'flea-beetle.jpg',
                                    severity_info: 'More information on pest severity',
                                    link: 'labs.russell.wisc.edu/vegento/pests/flea-beetles')

imported_cabbageworm = DegreeDayPest.create!(name: "Imported Cabbageworm",
                                    remote_name: 'imported_cabbageworm',
                                    info: "Imported cabbageworms <i>(Pieris rapae)</i>, cabbage loopers <i>(Trichoplusia ni)</i> and diamondback moths <i>(Plutella xylostella)</i> are the three most significant caterpillar pests of Wisconsin cole crops, with the imported cabbage worm being the most significant. Damage caused by these pests is generally of little economic importance in Wisconsin.<br />",
                                    biofix_mm: 1,
                                    biofix_dd: 1,
                                    critical_value: 150,
                                    t_min: 50,
                                    t_max: nil,
                                    photo: 'imported-cabbageworm.jpg',
                                    severity_info: 'More information on pest severity',
                                    link: 'labs.russell.wisc.edu/vegento/insects/pests/caterpillar-pests-of-cole-crops')

japanese_beetle = DegreeDayPest.create!(name: "Japanese Beetle",
                               remote_name: 'japanese_beetle',
                               info: "Japanese beetle <i>(Popillia japonica)</i> adults are 3/8 inch long and a metallic green color, with copper wing covers and a series of white dots along the side of the abdomen. The larvae are a serious pest of turfgrass in late summer. Adults are active from late June to September and feed on the flowers, fruits, and leaves of a wide variety of plants, including asparagus, tomato, and eggplant. Trapping measures may actually attract more beetles and cause more damage.<br />",
                               biofix_mm: 1,
                               biofix_dd: 1,
                               critical_value: 1600,
                               t_min: 50,
                               t_max: 100,
                               photo: 'japanese-beetle.jpg',
                               severity_info: 'More information on pest severity',
                               link: 'labs.russell.wisc.edu/vegento/insects/pests/japanese-beetle')

lygus_bug = DegreeDayPest.create!(name: "Lygus Bug",
                         remote_name: 'lygus_bug',
                         info: "Lygus Bug Info",
                         biofix_mm: 1,
                         biofix_dd: 1,
                         critical_value: 275,
                         t_min: 52,
                         t_max: nil,
                         severity_info: 'More information on pest severity',
                         link: 'labs.russell.wisc.edu/vegento/pests')

mint_root_borer = DegreeDayPest.create!(name: "Mint Root Borer",
                               remote_name: 'mint_root_borer',
                               info: "Mint Root Borer Info",
                               biofix_mm: 4,
                               biofix_dd: 1,
                               critical_value: 1280,
                               t_min: 50,
                               t_max: nil,
                               severity_info: 'More information on pest severity',
                               link: 'labs.russell.wisc.edu/vegento/pests')

onion_maggot = DegreeDayPest.create!(name: "Onion Maggot",
                     remote_name: 'onion_maggot',
                     info: "Onion maggots <i>(Delia antiqua)</i> are small whitish larvae found in the bulbs of onions. The adult is a grayish fly that resembles the cabbage maggot. Onion maggots are a problem after a series of cool, wet springs. The most effective way to control these insects is to apply an insecticide in the furrow when planting.<br />",
                     biofix_mm: 1,
                     biofix_dd: 1,
                     critical_value: 680,
                     t_min: 39,
                     t_max: 84,
                     photo: 'onion-maggot.jpg',
                     severity_info: 'More information on pest severity',
                     link: 'labs.russell.wisc.edu/vegento/insects/pests/onion-maggot')

potato_psyllid = DegreeDayPest.create!(name: "Potato Psyllid",
                     remote_name: 'potato_psyllid',
                     info: "Potato Psyllid Info",
                     biofix_mm: 1,
                     biofix_dd: 1,
                     critical_value: 762,
                     t_min: 40,
                     t_max: 86,
                     severity_info: 'More information on pest severity',
                     link: 'labs.russell.wisc.edu/vegento/pests')

seedcorn_maggot = DegreeDayPest.create!(name: "Seedcorn Maggot",
                     remote_name: 'seedcorn_maggot',
                     info: "Seed corn maggot <i>(Delia platura)</i> is by far the most serious pest of all beans. The white legless maggot burrows into the seed or seedling, causing very poor seed germination and emergence, and/or stems without leaves (snake heads). The adult is a small grayish fly that looks identical to the cabbage maggot.<br />",
                     biofix_mm: 1,
                     biofix_dd: 1,
                     critical_value: 1080,
                     t_min: 50,
                     t_max: nil,
                     photo: 'seedcorn-maggot.jpg',
                     severity_info: 'More information on pest severity',
                     link: 'labs.russell.wisc.edu/vegento/pests/seedcorn-maggot')

squash_vine_borer = DegreeDayPest.create!(name: "Squash Vine Borer",
                     remote_name: 'squash_vine_borer',
                     info: "The squash vine borer <i>(Melittia cucurbitae)</i> is an annual pest of pumpkins and squash. Often, it is not recognized as a potential pest until too late and as a result, can produce a negative economic impact in some years. Winter squash is highly susceptible to attack.<br />",
                     biofix_mm: 1,
                     biofix_dd: 1,
                     critical_value: 900,
                     t_min: 50,
                     t_max: nil,
                     photo: 'squash-vine-borer.jpg',
                     severity_info: 'More information on pest severity',
                     link: 'labs.russell.wisc.edu/vegento/pests/squash-vine-borer')

stalk_borer = DegreeDayPest.create!(name: "Stalk Borer",
                     remote_name: 'stalk_borer',
                     info: "Stalk Borer Info",
                     biofix_mm: 1,
                     biofix_dd: 1,
                     critical_value: 1400,
                     t_min: 41,
                     t_max: 86,
                     severity_info: 'More information on pest severity',
                     link: 'labs.russell.wisc.edu/vegento/pests')

variegated_cutworm = DegreeDayPest.create!(name: "Variegated Cutworm",
                     remote_name: 'variegated_cutworm',
                     info: "These are the larval stage (caterpillar) of night-flying moths. They are whitish gray to brown worms, ranging from 1/2 to 2 inches long. They feed almost exclusively at night and hide in the soil during the day. All cutworms curl to a characteristic tight ball when exposed, making them easy to identify. Most cutworms cut plants off at or slightly below the soil surface, making recent transplants especially susceptible. Eventually, plants become too thick and tough for cutworms to feed. Adult females are attracted to tall grasses for egg laying, and cutworm numbers tend to be higher in weedy or trashy fields.<br /><br/>Almost all commercial vegetable crops such as asparagus, beets, onions, carrots, celery, and potatoes can be attacked by cutworms. It is very difficult to predict when and where an infestation will spring up, and pre-plant insecticide treatments will not control heavy cutworm infestations. Scouting fields on a weekly basis is the best method for monitoring cutworm activity. If damaging populations are found, a “rescue” treatment will be needed. Bait formulations are the preferred treatment if conditions are dry, whereas both baits and sprays can be used when the cutworms are feeding at the soil surface.<br />",
                     biofix_mm: 5,
                     biofix_dd: 1,
                     critical_value: 1150,
                     t_min: 41,
                     t_max: 88,
                     photo: 'cutworm-larvae.jpg',
                     severity_info: 'More information on pest severity',
                     link: 'labs.russell.wisc.edu/vegento/pests/black-cutworm')

western_bean_cutworm = DegreeDayPest.create!(name: "Western Bean Cutworm",
                                             remote_name: 'western_bean_cutworm',
                                             info: "These are the larval stage (caterpillar) of night-flying moths. They are whitish gray to brown worms, ranging from 1/2 to 2 inches long. They feed almost exclusively at night and hide in the soil during the day. All cutworms curl to a characteristic tight ball when exposed, making them easy to identify. Most cutworms cut plants off at or slightly below the soil surface, making recent transplants especially susceptible. Eventually, plants become too thick and tough for cutworms to feed. Adult females are attracted to tall grasses for egg laying, and cutworm numbers tend to be higher in weedy or trashy fields.<br /><br/>Almost all commercial vegetable crops such as asparagus, beets, onions, carrots, celery, and potatoes can be attacked by cutworms. It is very difficult to predict when and where an infestation will spring up, and pre-plant insecticide treatments will not control heavy cutworm infestations. Scouting fields on a weekly basis is the best method for monitoring cutworm activity. If damaging populations are found, a “rescue” treatment will be needed. Bait formulations are the preferred treatment if conditions are dry, whereas both baits and sprays can be used when the cutworms are feeding at the soil surface.<br />",
                                             biofix_mm: 5,
                                             biofix_dd: 1,
                                             critical_value: 1320,
                                             t_min: 45,
                                             t_max: 104,
                                             photo: 'cutworm-larvae.jpg',
                                             severity_info: 'More information on pest severity',
                                             link: 'labs.russell.wisc.edu/vegento/pests/black-cutworm')

DegreeDayPest.create!(name: "Western Flower Thrip",
                                     remote_name: 'western_flower_thrip',
                                     info: "Thrips are small 1/25-inch insects that cause whitish scratches or brownish blotches on plant leaves. Hot dry weather is correlated with severe thrips problems. Thrips attack cabbage and cause a brownish scarring in the head of processing cabbage. Thrips must be controlled before the plant heads out in order to assure proper coverage and control. In onions the injury looks similar to both ozone injury and some diseases. Use large volumes sprays (100 gallons/acre) with a wetting agent for thrips control. A second treatment 5 to 7 days later may be warranted.<br />",
                                     biofix_mm: 1,
                                     biofix_dd: 1,
                                     critical_value: 675,
                                     t_min: 45,
                                     t_max: 104,
                                     photo: 'thrips.png',
                                     severity_info: 'More information on pest severity',
                                     link: 'labs.russell.wisc.edu/vegento/pests/onion-thrips')




alfalfa = Crop.create!(name: "Alfalfa")
alfalfa.pests = [alfalfa_weevil]

asparagus = Crop.create!(name: "Asparagus")
asparagus.pests = [asparagus_beetle, black_cutworm, western_bean_cutworm,
                   variegated_cutworm, japanese_beetle]

bean = Crop.create!(name: "Bean")
bean.pests = [corn_earworm, black_cutworm, western_bean_cutworm,
              variegated_cutworm, european_corn_borer, japanese_beetle,
              seedcorn_maggot]

beet= Crop.create!(name: "Beet")
beet.pests = [black_cutworm, western_bean_cutworm, variegated_cutworm,
              japanese_beetle]

carrot= Crop.create!(name: "Carrot")
carrot.pests = [foliar_disease, black_cutworm, western_bean_cutworm,
                variegated_cutworm]

celery= Crop.create!(name: "Celery")
celery.pests = [cabbage_looper, black_cutworm, western_bean_cutworm,
                variegated_cutworm, lygus_bug]

cole= Crop.create!(name: "Cole Crops")
cole.pests = [cabbage_looper, flea_beetle_crucifer, imported_cabbageworm,
              japanese_beetle, cabbage_maggot]

corn= Crop.create!(name: "Corn (Field and Sweet)")
corn.pests = [stink_bug, corn_earworm, corn_rootworm, black_cutworm,
              western_bean_cutworm, variegated_cutworm, european_corn_borer,
              seedcorn_maggot, stalk_borer]

cucumber= Crop.create!(name: "Cucumber")
cucumber.pests = [black_cutworm, western_bean_cutworm, variegated_cutworm,
                  seedcorn_maggot, squash_vine_borer]

eggplant= Crop.create!(name: "Eggplant")
eggplant.pests = [colorado_potato_beetle, european_corn_borer, japanese_beetle]

hops= Crop.create!(name: "Hops")
hops.pests = [cabbage_looper, black_cutworm, western_bean_cutworm,
              variegated_cutworm, japanese_beetle]

horseradish= Crop.create!(name: "Horseradish")
horseradish.pests = [japanese_beetle]

leafy_greens= Crop.create!(name: "Leafy Greens")
leafy_greens.pests = [cabbage_looper, variegated_cutworm, japanese_beetle,
                      lygus_bug]

melon= Crop.create!(name: "Melon")
melon.pests = [cabbage_looper, black_cutworm, western_bean_cutworm,
               variegated_cutworm, japanese_beetle, seedcorn_maggot,
               squash_vine_borer]

mint = Crop.create!(name: "Mint")
mint.pests = [cabbage_looper, black_cutworm, western_bean_cutworm,
              variegated_cutworm, flea_beetle_mint,  japanese_beetle,
              mint_root_borer]

onion = Crop.create!(name: "Onion")
onion.pests = [onion_maggot]

pea = Crop.create!(name: "Pea")
pea.pests = [cabbage_looper, black_cutworm, japanese_beetle]

pepper = Crop.create!(name: "Pepper")
pepper.pests = [european_corn_borer, japanese_beetle]

potato= Crop.create!(name: "Potato")
potato.pests = [late_blight, cabbage_looper, colorado_potato_beetle,
                black_cutworm, western_bean_cutworm, variegated_cutworm,
                european_corn_borer, japanese_beetle, lygus_bug, potato_psyllid]

pumpkin_squash= Crop.create!(name: "Pumpkin and Squash")
pumpkin_squash.pests = [japanese_beetle, seedcorn_maggot, squash_vine_borer]

tomato = Crop.create!(name: "Tomato")
tomato.pests = [cabbage_looper, colorado_potato_beetle, black_cutworm,
                western_bean_cutworm, variegated_cutworm, japanese_beetle]

Crop.create!(name: "Wheat/Small Grains")
