# Simple python script to download the base sliders from the web
# and save them to the base_sliders folder

import urllib.request
import os

# The base sliders are stored on https://runeapps.org
baseURL = "https://runeapps.org"

# This is the list of base sliders that we want to download
baseSliders = ["/apps/slidesolver/tileimgs/bandos.png",
               "/apps/slidesolver/tileimgs/troll.png",
               "/apps/slidesolver/tileimgs/castle.png",
               "/apps/slidesolver/tileimgs/bridge.png",
               "/apps/slidesolver/tileimgs/corp.png",
               "/apps/slidesolver/tileimgs/dragon.png",
               "/apps/slidesolver/tileimgs/maple.png",
               "/apps/slidesolver/tileimgs/sliske.png",
               "/apps/slidesolver/tileimgs/guthixsword.png",
               "/apps/slidesolver/tileimgs/elf.png",
               "/apps/slidesolver/tileimgs/tuska.png",
               "/apps/slidesolver/tileimgs/elderdrag.png",
               "/apps/slidesolver/tileimgs/v.png",
               "/apps/slidesolver/tileimgs/vyre.png",
               "/apps/slidesolver/tileimgs/nomad.png",
               "/apps/slidesolver/tileimgs/cit.png",
               "/apps/slidesolver/tileimgs/float.png",
               "/apps/slidesolver/tileimgs/frost.png",
               "/apps/slidesolver/tileimgs/archer.png",
               "/apps/slidesolver/tileimgs/ara.png",
               "/apps/slidesolver/tileimgs/zam.png",
               "/apps/slidesolver/tileimgs/mage.png",
               "/apps/slidesolver/tileimgs/helwyr.png",
               "/apps/slidesolver/tileimgs/wolf.png",
               "/apps/slidesolver/tileimgs/jas.png",
               "/apps/slidesolver/tileimgs/menn.png",
               "/apps/slidesolver/tileimgs/seal.png"]

# Save these in the base_sliders folder
currentDir = os.path.dirname(
    os.path.realpath(__file__)) + "\\" + "base_sliders_unnamed"

# Loop through the base sliders and download them
for baseSlider in baseSliders:
    # Use incrementing names for the base sliders
    baseSliderName = str(baseSliders.index(baseSlider)) + ".data.png"
    # Get the full URL
    fullURL = baseURL + baseSlider
    # Get the full path
    fullPath = os.path.join(currentDir, baseSliderName)
    # Download the base slider
    urllib.request.urlretrieve(fullURL, fullPath)

    # Print a message to the user
    print("Downloaded " + baseSliderName)

# Print a message to the user
print("Downloaded base sliders to " + currentDir)
