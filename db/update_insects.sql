update pests
   set t_min = 48,
       t_max = null
where name = 'Alfalfa Weevil';

update pests
   set info='The common <i>(Crioceris asparagi)</i> and spotted <i>(Crioceris duodecimpunctata)</i> asparagus beetles are annual pests of asparagus in Wisconsin. The common asparagus beetle is the most prevalent and the only one that causes economic damage to asparagus.<br />',
       photo = 'asparagus-beetle-common.jpg',
       t_min = 50,
       t_max = 86
 where name = 'Asparagus Beetle (Common)';

update pests
   set info='These are the larval stage (caterpillar) of night-flying moths. They are whitish gray to brown worms, ranging from 1/2 to 2 inches long. They feed almost exclusively at night and hide in the soil during the day. All cutworms curl to a characteristic tight ball when exposed, making them easy to identify. Most cutworms cut plants off at or slightly below the soil surface, making recent transplants especially susceptible. Eventually, plants become too thick and tough for cutworms to feed. Adult females are attracted to tall grasses for egg laying, and cutworm numbers tend to be higher in weedy or trashy fields.<br /><br/>Almost all commercial vegetable crops such as asparagus, beets, onions, carrots, celery, and potatoes can be attacked by cutworms. It is very difficult to predict when and where an infestation will spring up, and pre-plant insecticide treatments will not control heavy cutworm infestations. Scouting fields on a weekly basis is the best method for monitoring cutworm activity. If damaging populations are found, a “rescue” treatment will be needed. Bait formulations are the preferred treatment if conditions are dry, whereas both baits and sprays can be used when the cutworms are feeding at the soil surface.<br />',
   t_min = 50.7,
   t_max = 86,
   photo = 'cutworm-larvae.jpg'
 where name = 'Black Cutworm';

update pests
   set t_min = 54,
       t_max = 92
 where name = 'Brown Marmorated Stink Bug';

update pests
   set info='Imported cabbageworms <i>(Pieris rapae)</i>, cabbage loopers <i>(Trichoplusia ni)</i> and diamondback moths <i>(Plutella xylostella)</i> are the three most significant caterpillar pests of Wisconsin cole crops, with the imported cabbage worm being the most significant. The cabbage looper attacks beets, celery, lettuce, peas, potatoes, spinach and tomatoes, in addition to cole crops. Damage caused by these pests is generally of little economic importance in Wisconsin.<br />',
   t_min = 50,
   t_max = 90,
   photo = 'cabbage-looper.jpg'
 where name = 'Cabbage Looper';

update pests
   set info='The adult cabbage maggot <i>(Delia radicum)</i> is a small gray fly that lays its eggs at the base of crop plants in the cabbage family. The small, cylindrical white eggs hatch into legless white maggots that feed on the roots. Seedling plants can be killed rapidly, while transplants tend to wilt and die slowly. Root crucifers such as radish and turnip show surface tunneling that is often accompanied by soft rots.<br />',
       t_min = 39.7,
       t_max = 86,
       photo = 'cabbage-maggot.jpg'
 where name = 'Cabbage Maggot';

update pests
   set info='The Colorado potato beetle <i>(Leptinotarsa decemlineata)</i> is the most distinctive pest of potatoes. Both the yellow-and-black striped adults and the brick-red humped larvae feed on the foliage. Feeding normally is initiated on the terminal growth and can be severe. Adults overwinter and move to emerging potatoes early in the spring (May). The adults lay bright yellow egg masses, and larvae feed for several weeks in the summer before pupating in the soil. Emerging adults then continue feeding throughout the season until no vines remain.<br />',
       t_min = 52,
       t_max = null,
       photo = 'colorado-potato-beetle.jpg'
 where name = 'Colorado Potato Beetle';

update pests
   set info='Corn earworm <i>(Helicoverpa zea)</i> caterpillars are varicolored, smooth, up to 2 inches long and feed mostly on ear tips. Insecticide treatment is necessary for early market sweet corn and for late-season canning or market sweet corn (silking after August 15).<br />',
       t_min = 55,
       t_max = 92,
       photo = 'corn_earworm.jpg'
where name = 'Corn Earworm';

update pests
   set info='Rootworm <i>(genus Diabrotica)</i> larvae are white with black heads and grow 1/2 inch long. Northern and western rootworm larvae cannot be differentiated in the field. They feed on crown roots from June to August, causing corn to lodge and “gooseneck.”<br/><br />Rootworms are most serious in loam soils but are of little consequence in muck or non-irrigated sandy soils. The larvae are not a potential problem unless corn is planted on the same ground in a “rootworm area” for 2 or more years in succession. Annual crop rotation controls these insects, because eggs overwinter in the soil.<br />',
       t_min = 52,
       t_max = null,
       photo = 'corn-rootworm.jpg'
 where name = 'Corn Rootworm';

update pests
   set info='European corn borer <i>(Ostrinia nubilalis)</i> larvae are between 3/4 to 1 inch long and range in color from grey to creamy white, with a black head and numerous spots over the body. In most of Wisconsin, two generations of eggs are laid on the undersides of leaves. First generation larvae typically cause damage only to leaves and stalks, unless the corn is already tasseling, in which case the larvae will enter the ear. In Southern Wisconsin, begin checking early sweet corn for egg masses by June 15th. Second generation larvae develop from eggs laid in mid-August and cause heavy infestations in late-planted corn. Direct feeding on kernels may make sweet corn unmarketable.<br />',
      t_min = 50,
      t_max = 86,
      photo = 'european-corn-borer.jpg'
 where name = 'European Corn Borer';

update pests
   set info='Flea beetles <i>(Tribe Alticini)</i> are frequently a pest of early plantings. These small, shiny black beetles, which jump when approached, chew small circular holes in the leaves. This damage is insignificant on large potatoes and tomatoes but young seedlings can be rapidly killed.Young seedlings or transplants of cabbage, broccoli, beet, tomato, eggplant, and all vine crops should be scouted on a weekly basis when they are young. If flea beetle activity is seen, an insecticide rescue treatment will be needed.<br />',
       t_min = 50,
       t_max = null,
       photo = 'flea-beetle.jpg'
 where name = 'Flea Beetle (Crucifer)';

update pests
   set info='Flea beetles <i>(Tribe Alticini)</i> are frequently a pest of early plantings. These small, shiny black beetles, which jump when approached, chew small circular holes in the leaves. This damage is insignificant on large potatoes and tomatoes but young seedlings can be rapidly killed.Young seedlings or transplants of cabbage, broccoli, beet, tomato, eggplant, and all vine crops should be scouted on a weekly basis when they are young. If flea beetle activity is seen, an insecticide rescue treatment will be needed.<br />',
       t_min = 41,
       t_max = 103,
       photo = 'flea-beetle.jpg'
 where name = 'Flea Beetle (Mint)';

update pests
   set info='Imported cabbageworms <i>(Pieris rapae)</i>, cabbage loopers <i>(Trichoplusia ni)</i> and diamondback moths <i>(Plutella xylostella)</i> are the three most significant caterpillar pests of Wisconsin cole crops, with the imported cabbage worm being the most significant. Damage caused by these pests is generally of little economic importance in Wisconsin.<br />',
       t_min = 50,
       t_max = null,
       photo = 'imported-cabbageworm.jpg'
 where name = 'Imported Cabbageworm';
 
update pests
   set info='Japanese beetle <i>(Popillia japonica)</i> adults are 3/8 inch long and a metallic green color, with copper wing covers and a series of white dots along the side of the abdomen. The larvae are a serious pest of turfgrass in late summer. Adults are active from late June to September and feed on the flowers, fruits, and leaves of a wide variety of plants, including asparagus, tomato, and eggplant. Trapping measures may actually attract more beetles and cause more damage.<br />',
       t_min = 50,
       t_max = 100,
       photo = 'japanese-beetle.jpg'
 where name = 'Japanese Beetle';

update pests
   set t_min = 52,
       t_max = null
 where name = 'Lygus Bug';

update pests
   set t_min = 50,
       t_max = null
where name = 'Mint Root Borer';

update pests
   set info='Onion maggots <i>(Delia antiqua)</i> are small whitish larvae found in the bulbs of onions. The adult is a grayish fly that resembles the cabbage maggot. Onion maggots are a problem after a series of cool, wet springs. The most effective way to control these insects is to apply an insecticide in the furrow when planting.<br />',
       t_min = 39,
       t_max = 84,
       photo = 'onion-maggot.jpg'
 where name = 'Onion Maggot';

update pests
   set t_min = 40,
       t_max = 86
 where name = 'Potato Psyllid';

update pests
   set info='Seed corn maggot <i>(Delia platura)</i> is by far the most serious pest of all beans. The white legless maggot burrows into the seed or seedling, causing very poor seed germination and emergence, and/or stems without leaves (snake heads). The adult is a small grayish fly that looks identical to the cabbage maggot.<br />',
       t_min = 50,
       t_max = null,
       photo = 'seedcorn-maggot.jpg'
 where name = 'Seedcorn Maggot';

update pests
   set info='The squash vine borer <i>(Melittia cucurbitae)</i> is an annual pest of pumpkins and squash. Often, it is not recognized as a potential pest until too late and as a result, can produce a negative economic impact in some years. Winter squash is highly susceptible to attack.<br />',
       t_min = 50,
       t_max = null,
       photo = 'squash-vine-borer.jpg',
       name = 'Squash Vine Borer'
 where name = 'Squash Vine Borer';

update pests
   set t_min = 41,
       t_max = 86
 where name = 'Stalk Borer';

update pests
   set info='These are the larval stage (caterpillar) of night-flying moths. They are whitish gray to brown worms, ranging from 1/2 to 2 inches long. They feed almost exclusively at night and hide in the soil during the day. All cutworms curl to a characteristic tight ball when exposed, making them easy to identify. Most cutworms cut plants off at or slightly below the soil surface, making recent transplants especially susceptible. Eventually, plants become too thick and tough for cutworms to feed. Adult females are attracted to tall grasses for egg laying, and cutworm numbers tend to be higher in weedy or trashy fields.<br /><br/>Almost all commercial vegetable crops such as asparagus, beets, onions, carrots, celery, and potatoes can be attacked by cutworms. It is very difficult to predict when and where an infestation will spring up, and pre-plant insecticide treatments will not control heavy cutworm infestations. Scouting fields on a weekly basis is the best method for monitoring cutworm activity. If damaging populations are found, a “rescue” treatment will be needed. Bait formulations are the preferred treatment if conditions are dry, whereas both baits and sprays can be used when the cutworms are feeding at the soil surface.<br />',
       t_min = 41,
       t_max = 88,
       photo = 'cutworm-larvae.jpg'
where name = 'Variegated Cutworm';

update pests
   set info='These are the larval stage (caterpillar) of night-flying moths. They are whitish gray to brown worms, ranging from 1/2 to 2 inches long. They feed almost exclusively at night and hide in the soil during the day. All cutworms curl to a characteristic tight ball when exposed, making them easy to identify. Most cutworms cut plants off at or slightly below the soil surface, making recent transplants especially susceptible. Eventually, plants become too thick and tough for cutworms to feed. Adult females are attracted to tall grasses for egg laying, and cutworm numbers tend to be higher in weedy or trashy fields.<br /><br/>Almost all commercial vegetable crops such as asparagus, beets, onions, carrots, celery, and potatoes can be attacked by cutworms. It is very difficult to predict when and where an infestation will spring up, and pre-plant insecticide treatments will not control heavy cutworm infestations. Scouting fields on a weekly basis is the best method for monitoring cutworm activity. If damaging populations are found, a “rescue” treatment will be needed. Bait formulations are the preferred treatment if conditions are dry, whereas both baits and sprays can be used when the cutworms are feeding at the soil surface.<br />',
       t_min = 50,
       t_max = null,
photo = 'cutworm-larvae.jpg'
where name = 'Western Bean Cutworm';

update pests
   set info='Thrips are small 1/25-inch insects that cause whitish scratches or brownish blotches on plant leaves. Hot dry weather is correlated with severe thrips problems. Thrips attack cabbage and cause a brownish scarring in the head of processing cabbage. Thrips must be controlled before the plant heads out in order to assure proper coverage and control. In onions the injury looks similar to both ozone injury and some diseases. Use large volumes sprays (100 gallons/acre) with a wetting agent for thrips control. A second treatment 5 to 7 days later may be warranted.<br />',
       t_min = 45,
       t_max = 104,
       photo = 'thrips.png'
where name = 'Western Flower Thrip';

update pests
set info='<u><b>Alternaria leaf blight</b></u>: the seedborne Alternaria fungus causes dark-brown lesions on leaflets and petioles that weaken and/or kill carrot foliage, causing separation from root crowns during mechanical harvest.<br /><br />Disease management includes using certified or heat-treated seed, crop rotation, in- furrow irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.<br /><br /><u><b>Cercospora leaf blight</b></u>: the potentially seedborne Cercospora fungus causes tan lesions with a darker brown margin on carrot leaflets and petioles. Plant growth can be reduced from dead, curled leaflets and, in severe cases, death of the entire canopy.<br /><br />Disease management includes using certified or pre-treated seed, crop rotation, avoiding overhead irrigation to reduce foliar wetness, and disease forecasting programs for initiating a fungicide program.<br /><br />'
where name = 'Foliar Disease';

update pests
set info='<u><b>Late blight</b></u>: Phytophthora infestans infects all aboveground plant parts and potato tubers and can be transmitted via seed, culls, volunteers, and weeds (i.e., nightshade). Foliar infections begin with watersoaking and progress quickly to cause tan/brown dead tissue. Brown cankers can girdle petioles and stems. White, downy sporulation is often visible, with high humidity, on undersides of leaves along lesion edges. Infected tomato fruits remain firm underneath mottled-looking brown areas. Infected tubers appear as brown decay on the surface and into the top ¼-inch of tissue. Late blight disease advances quickly under conditions of high humidity (≥90%) and cool temperatures (50-70°F). Prevention is critical for control. Eliminate culls and volunteer plants. Avoid prolonged wetness on leaves and canopy, use certified seed, and follow DSV accumulation values that prompt early, preventative fungicide applications. If disease is present, treat with appropriate fungicides on a 5-7 day spray interval.<br /><br />'
where name = 'Late Blight';

