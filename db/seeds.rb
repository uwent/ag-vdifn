late_blight = LateBlight.create!(name: "Late Blight",
                              remote_name: 'potato_blight_dsv',
                              info: "<u><b>Late blight</b></u>: Phytophthora infestans infects all aboveground plant parts and potato tubers and can be transmitted via seed, culls, volunteers, and weeds (i.e., nightshade). Foliar infections begin with watersoaking and progress quickly to cause tan/brown dead tissue. Brown cankers can girdle petioles and stems. White, downy sporulation is often visible, with high humidity, on undersides of leaves along lesion edges. Infected tomato fruits remain firm underneath mottled-looking brown areas. Infected tubers appear as brown decay on the surface and into the top ¼-inch of tissue. Late blight disease advances quickly under conditions of high humidity (≥90%) and cool temperatures (50-70°F). Prevention is critical for control. Eliminate culls and volunteer plants. Avoid prolonged wetness on leaves and canopy, use certified seed, and follow DSV accumulation values that prompt early, preventative fungicide applications. If disease is present, treat with appropriate fungicides on a 5-7 day spray interval.<br /><br />",
                              biofix_mm: 1, biofix_dd: 1,
                              critical_value: 0,
                              link: 'www.plantpath.wisc.edu/wivegdis/contents_pages/late_blight.html')

foliar_disease = FoliarDisease.create!(name: "Foliar Disease",
                                       remote_name: 'carrot_foliar_dsv',
                                       info: "<u><b>Alternaria leaf blight</b></u>: the seedborne Alternaria fungus causes dark-brown lesions on leaflets and petioles that weaken and/or kill carrot foliage, causing separation from root crowns during mechanical harvest.<br /><br />Disease management includes using certified or heat-treated seed, crop rotation, in- furrow irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.<br /><br /><u><b>Cercospora leaf blight</b></u>: the potentially seedborne Cercospora fungus causes tan lesions with a darker brown margin on carrot leaflets and petioles. Plant growth can be reduced from dead, curled leaflets and, in severe cases, death of the entire canopy.<br /><br />Disease management includes using certified or pre-treated seed, crop rotation, avoiding overhead irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.<br /><br />",
                                       biofix_mm: 1, biofix_dd: 1,
                                       critical_value: 0,
                                       link: 'www.plantpath.wisc.edu/wivegdis')


alfalfa_weevil = DegreeDayPest.create!(name: "Alfalfa Weevil",
                              remote_name: 'alfalfa_weevil',
                              info: "Alfalfa Weevil Info",
                              biofix_mm: 1, biofix_dd: 1,
                              critical_value: 371,
                              t_min: 48,
                              t_max: nil,
                              link: 'labs.russell.wisc.edu/vegento/pests')

asparagus_beetle = DegreeDayPest.create!(name: "Asparagus Beetle (Common)",
                                info: "The common <i>(Crioceris asparagi)</i> and spotted <i>(Crioceris duodecimpunctata)</i> asparagus beetles are annual pests of asparagus in Wisconsin. The common asparagus beetle is the most prevalent and the only one that causes economic damage to asparagus.<br />",
                                photo: 'asparagus-beetle-common.jpg',
                                t_min: 50,
                                t_max: 86,
                                remote_name: 'asparagus_beetle',
                                biofix_mm: 1, biofix_dd: 1,
                                critical_value: 105,
                                link: 'labs.russell.wisc.edu/vegento/pests/asparagus-beetle')

black_cutworm = DegreeDayPest.create!(name: "Black Cutworm",
                          info: "These are the larval stage (caterpillar) of night-flying moths. They are whitish gray to brown worms, ranging from 1/2 to 2 inches long. They feed almost exclusively at night and hide in the soil during the day. All cutworms curl to a characteristic tight ball when exposed, making them easy to identify. Most cutworms cut plants off at or slightly below the soil surface, making recent transplants especially susceptible. Eventually, plants become too thick and tough for cutworms to feed. Adult females are attracted to tall grasses for egg laying, and cutworm numbers tend to be higher in weedy or trashy fields.<br /><br/>Almost all commercial vegetable crops such as asparagus, beets, onions, carrots, celery, and potatoes can be attacked by cutworms. It is very difficult to predict when and where an infestation will spring up, and pre-plant insecticide treatments will not control heavy cutworm infestations. Scouting fields on a weekly basis is the best method for monitoring cutworm activity. If damaging populations are found, a “rescue” treatment will be needed. Bait formulations are the preferred treatment if conditions are dry, whereas both baits and sprays can be used when the cutworms are feeding at the soil surface.<br />",
                           t_min: 50.7,
                           t_max: 86,
                           photo: 'cutworm-larvae.jpg',
                           remote_name: 'black_cutworm',
                           biofix_mm: 5, biofix_dd: 15,
                           critical_value: 400,
                           link: 'labs.russell.wisc.edu/vegento/pests/black-cutworm')

stink_bug = BrownMarmoratedStinkBug.create!(name: "Brown Marmorated Stink Bug",
                         remote_name: 'brown_marmorated_stink_bug',
                         info: "Brown Marmorated Stink Bug Info",
                         biofix_mm: 1, biofix_dd: 1,
                         critical_value: 1608,
                         t_min: 54,
                         t_max: 92,
                         link: 'labs.russell.wisc.edu/vegento/pests')

cabbage_looper = DegreeDayPest.create!(name: 'Cabbage Looper',
                              remote_name: 'cabbage_looper',
                              info: "Imported cabbageworms <i>(Pieris rapae)</i>, cabbage loopers <i>(Trichoplusia ni)</i> and diamondback moths <i>(Plutella xylostella)</i> are the three most significant caterpillar pests of Wisconsin cole crops, with the imported cabbage worm being the most significant. The cabbage looper attacks beets, celery, lettuce, peas, potatoes, spinach and tomatoes, in addition to cole crops. Damage caused by these pests is generally of little economic importance in Wisconsin.<br />",
                              biofix_mm: 5, biofix_dd: 15,
                              critical_value: 325,
                              t_min: 50,
                              t_max: 90,
                              photo: 'cabbage-looper.jpg',
                              link: 'labs.russell.wisc.edu/vegento/pests/caterpillar-pests-of-cole-crops')

cabbage_maggot = DegreeDayPest.create!(name: 'Cabbage Maggot',
                              remote_name: 'cabbage_maggot',
                              info: "The adult cabbage maggot <i>(Delia radicum)</i> is a small gray fly that lays its eggs at the base of crop plants in the cabbage family. The small, cylindrical white eggs hatch into legless white maggots that feed on the roots. Seedling plants can be killed rapidly, while transplants tend to wilt and die slowly. Root crucifers such as radish and turnip show surface tunneling that is often accompanied by soft rots.<br />",
                              biofix_mm: 1, biofix_dd: 1,
                              critical_value: 360,
                              t_min: 39.7,
                              t_max: 86,
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
                              link: 'labs.russell.wisc.edu/vegento/pests/colorado-potato-beetle')

corn_earworm = DegreeDayPest.create!(name: "Corn Earworm",
                         remote_name: 'corn_earworm',
                         info: "Corn earworm <i>(Helicoverpa zea)</i> caterpillars are varicolored, smooth, up to 2 inches long and feed mostly on ear tips. Insecticide treatment is necessary for early market sweet corn and for late-season canning or market sweet corn (silking after August 15).<br />",
                         biofix_mm: 8, biofix_dd: 1,
                         critical_value: 73,
                         t_min: 55,
                         t_max: 92,
                         photo: 'corn_earworm.jpg',
                         link: 'labs.russell.wisc.edu/vegento/pests/corn-earworm')

corn_rootworm = CornRootworm.create!(name: "Corn Rootworm",
                             remote_name: 'corn_rootworm',
                             info: "Rootworm <i>(genus Diabrotica)</i> larvae are white with black heads and grow 1/2 inch long. Northern and western rootworm larvae cannot be differentiated in the field. They feed on crown roots from June to August, causing corn to lodge and “gooseneck.”<br/><br />Rootworms are most serious in loam soils but are of little consequence in muck or non-irrigated sandy soils. The larvae are not a potential problem unless corn is planted on the same ground in a “rootworm area” for 2 or more years in succession. Annual crop rotation controls these insects, because eggs overwinter in the soil.<br />",
                             biofix_mm: 1, biofix_dd: 1,
                             critical_value: 329,
                             t_min: 52,
                             t_max: nil,
                             photo: 'corn-rootworm.jpg',
                             link: 'labs.russell.wisc.edu/vegento/pests/corn-rootworms')

european_corn_borer = DegreeDayPest.create!(name: "European Corn Borer",
                                   remote_name: 'european_corn_borer',
                                   info: "European corn borer <i>(Ostrinia nubilalis)</i> larvae are between 3/4 to 1 inch long and range in color from grey to creamy white, with a black head and numerous spots over the body. In most of Wisconsin, two generations of eggs are laid on the undersides of leaves. First generation larvae typically cause damage only to leaves and stalks, unless the corn is already tasseling, in which case the larvae will enter the ear. In Southern Wisconsin, begin checking early sweet corn for egg masses by June 15th. Second generation larvae develop from eggs laid in mid-August and cause heavy infestations in late-planted corn. Direct feeding on kernels may make sweet corn unmarketable.<br />",
                                   biofix_mm: 1, biofix_dd: 1,
                                   critical_value: 690,
                                   t_min: 50,
                                   t_max: 86,
                                   photo: 'european-corn-borer.jpg',
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
                               link: 'labs.russell.wisc.edu/vegento/insects/pests/japanese-beetle')

lygus_bug = DegreeDayPest.create!(name: "Lygus Bug",
                         remote_name: 'lygus_bug',
                         info: "Lygus Bug Info",
                         biofix_mm: 1,
                         biofix_dd: 1,
                         critical_value: 275,
                         t_min: 52,
                         t_max: nil,
                         link: 'labs.russell.wisc.edu/vegento/pests')

mint_root_borer = DegreeDayPest.create!(name: "Mint Root Borer",
                               remote_name: 'mint_root_borer',
                               info: "Mint Root Borer Info",
                               biofix_mm: 4,
                               biofix_dd: 1,
                               critical_value: 1280,
                               t_min: 50,
                               t_max: nil,
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
                     link: 'labs.russell.wisc.edu/vegento/insects/pests/onion-maggot')

potato_psyllid = DegreeDayPest.create!(name: "Potato Psyllid",
                     remote_name: 'potato_psyllid',
                     info: "Potato Psyllid Info",
                     biofix_mm: 1,
                     biofix_dd: 1,
                     critical_value: 762,
                     t_min: 40,
                     t_max: 86,
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
                     link: 'labs.russell.wisc.edu/vegento/pests/squash-vine-borer')

stalk_borer = DegreeDayPest.create!(name: "Stalk Borer",
                     remote_name: 'stalk_borer',
                     info: "Stalk Borer Info",
                     biofix_mm: 1,
                     biofix_dd: 1,
                     critical_value: 1400,
                     t_min: 41,
                     t_max: 86,
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
