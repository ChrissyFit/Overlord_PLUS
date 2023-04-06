
from PIL import Image, ImageDraw, ImageFont
import textwrap
import sys

def create_image(phrase):
    img = Image.open("commands/entertainment/muscleman-files/muscleman.png")
    phrase = textwrap.wrap(phrase, width=20)

    editImg = ImageDraw.Draw(img)
    myFont = ImageFont.truetype(".fonts/impact.ttf", 50)

    if len(phrase) == 1:
        editImg.multiline_text(
            (240, 50), "You know who else \n" + phrase[0],
            align="center", anchor="ms", font=myFont,
            fill=(0, 0, 0), stroke_fill=(255, 255, 255),
            stroke_width=2)
    else:
        i = 0
        multiPhrase = ""
        while i < len(phrase):
            multiPhrase += phrase[i] + "\n"
            i += 1

        editImg.multiline_text(
            (240, 50), "You know who else \n" + multiPhrase,
            align="center", anchor="ms", font=myFont,
            fill=(0, 0, 0), stroke_fill=(255, 255, 255),
            stroke_width=2)

    img.save("commands/entertainment/muscleman-files/muscleman_meme_temp.png")

create_image(sys.argv[1])