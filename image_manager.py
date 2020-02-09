import random
import os
from os import listdir
from os.path import isfile, join
from os import walk


class imageManager (object):

    def __init__(self, path="img"):

        image_paths = []
        categories = []
        array = []

        categories = next(os.walk(path))[1]


        for category in categories:

            this_category = []

            category_path = path + "/" + category

            for (dirpath, dirnames, filenames) in walk(category_path):
            

                this_category.extend(filenames)


            for file in this_category:
                if not file.endswith(".jpg"):
                    this_category.remove(file)

            array.append(this_category)

        self.array = array


    def get_random_images (self):

        images = []

        category_ID = random.randint(0, len(self.array)-1)

        print (category_ID)

        category = self.array[category_ID]

        image_IDs = random.sample(range(1, len(category)), 8)

        for image_ID in image_IDs: 
            images.append(self.array[category_ID][image_ID])

        return images


i = imageManager()

print (i.get_random_images())