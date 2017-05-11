# coding: utf-8
late_blight = LateBlight.create!(name: "Late Blight",
                              remote_name: 'potato_blight_dsv',
                              info: "<u>Late blight:</u> Phytophthora infestans infects all aboveground plant parts and potato tubers and can be transmitted via seed, culls, volunteers, and weeds (i.e., nightshade). Foliar infections begin with watersoaking and progress quickly to cause tan/brown dead tissue. Brown cankers can girdle petioles and stems. White, downy sporulation is often visible, with high humidity, on undersides of leaves along lesion edges. Infected tomato fruits remain firm underneath mottled-looking brown areas. Infected tubers appear as brown decay on the surface and into the top ¼-inch of tissue. Late blight disease advances quickly under conditions of high humidity (≥90%) and cool temperatures (50-70°F). Prevention is critical for control. Eliminate culls and volunteer plants. Avoid prolonged wetness on leaves and canopy, use certified seed, and follow DSV accumulation values that prompt early, preventative fungicide applications. If disease is present, treat with appropriate fungicides on a 5-7 day spray interval.<br /><br />[<a href='http://www.plantpath.wisc.edu/wivegdis/'>http://www.plantpath.wisc.edu/wivegdis/</a>]",
                              biofix_mm: 1, biofix_dd: 1,
                              critical_value: 0,
                              link: 'www.plantpath.wisc.edu/wivegdis/contents_pages/late_blight.html')

foliar_disease = FoliarDisease.create!(name: "Foliar Disease",
                                       remote_name: 'carrot_foliar_dsv',
                                       info: "<u>Alternaria leaf blight:</u> the seedborne Alternaria fungus causes dark-brown lesions on leaflets and petioles that weaken and/or kill carrot foliage, causing separation from root crowns during mechanical harvest.<br/><br/> Disease management includes using certified or heat-treated seed, crop rotation, in- furrow irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.<br/><br/><u>Cercospora leaf blight:</u> the potentially seedborne Cercospora fungus causes tan lesions with a darker brown margin on carrot leaflets and petioles. Plant growth can be reduced from dead, curled leaflets and, in severe cases, death of the entire canopy.<br /><br /> Disease management includes using certified or pre-treated seed, crop rotation, avoiding overhead irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.<br /><br />[<a href='http://www.plantpath.wisc.edu/wivegdis/'>http://www.plantpath.wisc.edu/wivegdis/</a>]",
                                       biofix_mm: 1, biofix_dd: 1,
                                       critical_value: 0,
                                       link: 'www.plantpath.wisc.edu/wivegdis')


alfalfa_weevil = DegreeDayPest.create!(name: "Alfalfa Weevil",
                              remote_name: 'alfalfa_weevil',
                              info: "Alfalfa Weevil Info",
                              biofix_mm: 1, biofix_dd: 1,
                              critical_value: 371,
                              link: 'labs.russell.wisc.edu/vegento/pests')

asparagus_beetle = DegreeDayPest.create!(name: "Asparagus Beetle (Common)",
                                remote_name: 'asparagus_beetle',
                                info: "Asparagus Beetle Info",
                                biofix_mm: 1, biofix_dd: 1,
                                critical_value: 105,
                                link: 'labs.russell.wisc.edu/vegento/pests/asparagus-beetle')

black_cutworm = DegreeDayPest.create!(name: "Black Cutworm",
                           remote_name: 'black_cutworm',
                           info: "Black Cutworm Info",
                           biofix_mm: 5, biofix_dd: 15,
                           critical_value: 400,
                           link: 'labs.russell.wisc.edu/vegento/pests/black-cutworm')

stink_bug = DegreeDayPest.create!(name: "Brown Marmorated Stink Bug",
                         remote_name: 'brown_marmorated_stink_bug',
                         info: "Brown Marmorated Stink Bug Info",
                         biofix_mm: 1, biofix_dd: 1,
                         critical_value: 1608,
                         link: 'labs.russell.wisc.edu/vegento/pests')

cabbage_looper = DegreeDayPest.create!(name: 'Cabbage Looper',
                              remote_name: 'cabbage_looper',
                              info: "Cabbage Looper Info",
                              biofix_mm: 5, biofix_dd: 15,
                              critical_value: 325,
                              link: 'labs.russell.wisc.edu/vegento/pests/caterpillar-pests-of-cole-crops')

cabbage_maggot = DegreeDayPest.create!(name: 'Cabbage Maggot',
                              remote_name: 'cabbage_maggot',
                              info: "Cabbage Maggot Info",
                              biofix_mm: 1, biofix_dd: 1,
                              critical_value: 360,
                              link: 'labs.russell.wisc.edu/vegento/pests/cabbage-maggot')

colorado_potato_beetle = DegreeDayPest.create!(name: 'Colorado Potato Beetle',
                              remote_name: 'colorado_potato_beetle',
                              info: "Colorado Potato Beetle Info",
                              biofix_mm: 5, biofix_dd: 1,
                              critical_value: 185,
                              link: 'labs.russell.wisc.edu/vegento/pests/colorado-potato-beetle')

corn_earworm = DegreeDayPest.create!(name: "Corn Earworm",
                         remote_name: 'corn_earworm',
                         info: "Corn Earwor Info",
                         biofix_mm: 8, biofix_dd: 1,
                         critical_value: 73,
                         link: 'labs.russell.wisc.edu/vegento/pests/corn-earworm')
corn_rootworm = DegreeDayPest.create!(name: "Corn Rootworm",
                             remote_name: 'corn_rootworm',
                             info: "Corn Rootworm Info",
                             biofix_mm: 1, biofix_dd: 1,
                             critical_value: 329,
                             link: 'labs.russell.wisc.edu/vegento/pests/corn-rootworms')

european_corn_borer = DegreeDayPest.create!(name: "European Corn Borer",
                                   remote_name: 'european_corn_borer',
                                   info: "European Corn Borer Info",
                                   biofix_mm: 1, biofix_dd: 1,
                                   critical_value: 690,
                                   link: 'labs.russell.wisc.edu/vegento/pests/european-corn-borer')

flea_beetle_mint = DegreeDayPest.create!(name: "Flea Beetle (Mint)",
                                remote_name: 'flea_beetle_mint',
                                info: "Flea Beetle Mint Info",
                                biofix_mm: 1, biofix_dd: 1,
                                critical_value: 1475,
                                link: 'labs.russell.wisc.edu/vegento/pests/flea-beetles')

flea_beetle_crucifer = DegreeDayPest.create!(name: "Flea Beetle (Crucifer)",
                                    remote_name: 'flea_beetle_crucifer',
                                    info: "Flea Beetle Crucifer Info",
                                    biofix_mm: 1, biofix_dd: 1,
                                    critical_value: 821,
                                    link: 'labs.russell.wisc.edu/vegento/pests/flea-beetles')

imported_cabbageworm = DegreeDayPest.create!(name: "Imported Cabbageworm",
                                    remote_name: 'imported_cabbageworm',
                                    info: "Imported Cabbageworm Info",
                                    biofix_mm: 1, biofix_dd: 1,
                                    critical_value: 150,
                                    link: 'labs.russell.wisc.edu/vegento/insects/pests/caterpillar-pests-of-cole-crops')

japanese_beetle = DegreeDayPest.create!(name: "Japanese Beetle",
                               remote_name: 'japanese_beetle',
                               info: "Japanese Beetle Info",
                               biofix_mm: 1, biofix_dd: 1,
                               critical_value: 1600,
                               link: 'labs.russell.wisc.edu/vegento/insects/pests/japanese-beetle')

lygus_bug = DegreeDayPest.create!(name: "Lygus Bug",
                         remote_name: 'lygus_bug',
                         info: "Lygus Bug Info",
                         biofix_mm: 1, biofix_dd: 1,
                         critical_value: 275,
                         link: 'labs.russell.wisc.edu/vegento/pests')

mint_root_borer = DegreeDayPest.create!(name: "Mint Root Borer",
                               remote_name: 'mint_root_borer',
                               info: "Mint Root Borer Info",
                               biofix_mm: 4, biofix_dd: 1,
                               critical_value: 1280,
                               link: 'labs.russell.wisc.edu/vegento/pests')

onion_maggot = DegreeDayPest.create!(name: "Onion Maggot",
                     remote_name: 'onion_maggot',
                     info: "Onion Maggot Info",
                     biofix_mm: 1, biofix_dd: 1,
                     critical_value: 680,
                     link: 'labs.russell.wisc.edu/vegento/insects/pests/onion-maggot')

potato_psyllid = DegreeDayPest.create!(name: "Potato Psyllid",
                     remote_name: 'potato_psyllid',
                     info: "Potato Psyllid Info",
                     biofix_mm: 1, biofix_dd: 1,
                     critical_value: 762,
                     link: 'labs.russell.wisc.edu/vegento/pests')

seedcorn_maggot = DegreeDayPest.create!(name: "Seedcorn Maggot",
                     remote_name: 'seedcorn_maggot',
                     info: "Seedcorn Maggot Info",
                     biofix_mm: 1, biofix_dd: 1,
                     critical_value: 1080,
                     link: 'labs.russell.wisc.edu/vegento/pests/seedcorn-maggot')

squash_vine_borer = DegreeDayPest.create!(name: "Squash Vine_Borer",
                     remote_name: 'squash_vine_borer',
                     info: "Squash Vine Borer Info",
                     biofix_mm: 1, biofix_dd: 1,
                     critical_value: 900,
                     link: 'labs.russell.wisc.edu/vegento/pests/squash-vine-borer')

stalk_borer = DegreeDayPest.create!(name: "Stalk Borer",
                     remote_name: 'stalk_borer',
                     info: "Stalk Borer Info",
                     biofix_mm: 1, biofix_dd: 1,
                     critical_value: 1400,
                     link: 'labs.russell.wisc.edu/vegento/pests')

variegated_cutworm = DegreeDayPest.create!(name: "Variegated Cutworm",
                     remote_name: 'variegated_cutworm',
                     info: "Variegated Cutworm Info",
                     biofix_mm: 5, biofix_dd: 1,
                     critical_value: 1150,
                     link: 'labs.russell.wisc.edu/vegento/pests/black-cutworm')

western_bean_cutworm = DegreeDayPest.create!(name: "Western Bean Cutworm",
                                    remote_name: 'western_bean_cutworm',
                                    info: "Western Bean Cutworm Info",
                     biofix_mm: 5, biofix_dd: 1,
                     critical_value: 1320,
                     link: 'labs.russell.wisc.edu/vegento/pests/black-cutworm')

western_flower_thrips = DegreeDayPest.create!(name: "Western Flower Thrip",
                                     remote_name: 'western_flower_thrip',
                                     info: "Western Flower Thrip Info",
                                     biofix_mm: 1, biofix_dd: 1,
                                     critical_value: 675,
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

wheat= Crop.create!(name: "Wheat/Small Grains")
