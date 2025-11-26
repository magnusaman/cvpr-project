# Test Images

This folder contains sample images for testing the multi-label classifier.

## Downloaded Test Images

1. **person_with_dog.jpg** - Person with a dog (tests: person, dog detection)
2. **city_street.jpg** - Urban street scene (tests: car, bus, person, traffic light)
3. **kitchen.jpg** - Kitchen scene (tests: bottle, bowl, cup, sink, refrigerator)
4. **mountain_landscape.jpg** - Outdoor landscape (tests: person, backpack, nature scenes)
5. **restaurant.jpg** - Restaurant interior (tests: chair, dining table, cup, person, bottle)

## Expected Detections

### person_with_dog.jpg
- person
- dog
- possibly: backpack, handbag

### city_street.jpg
- car
- bus
- person
- traffic light
- bicycle
- possibly: truck, motorcycle

### kitchen.jpg
- bottle
- bowl
- cup
- sink
- possibly: oven, microwave, refrigerator, spoon, fork

### mountain_landscape.jpg
- person
- backpack
- possibly: bench, skis

### restaurant.jpg
- person
- chair
- dining table
- cup
- wine glass
- fork
- knife
- bottle
- possibly: bowl, spoon

## Adding Your Own Images

Simply place any `.jpg`, `.png`, or `.jpeg` files in this directory!

**Supported formats:**
- JPG/JPEG
- PNG
- BMP
- GIF

**Recommended:**
- Resolution: 640x640 or higher
- Good lighting
- Clear objects
- Multiple objects for multi-label testing

## Running Tests

```bash
# Test all images in this directory
python test_yolo.py

# Or use the API
python api/flask_app_yolo.py
# Then upload images via web interface at http://localhost:5000
```

## COCO Classes (80 total)

The YOLOv8 model can detect these 80 object classes:

**People & Animals:**
person, bird, cat, dog, horse, sheep, cow, elephant, bear, zebra, giraffe

**Vehicles:**
bicycle, car, motorcycle, airplane, bus, train, truck, boat

**Outdoor Objects:**
traffic light, fire hydrant, stop sign, parking meter, bench

**Food & Kitchen:**
bottle, wine glass, cup, fork, knife, spoon, bowl, banana, apple, sandwich, orange, broccoli, carrot, hot dog, pizza, donut, cake

**Indoor Objects:**
chair, couch, potted plant, bed, dining table, toilet, tv, laptop, mouse, remote, keyboard, cell phone, microwave, oven, toaster, sink, refrigerator

**Accessories:**
backpack, umbrella, handbag, tie, suitcase

**Sports Equipment:**
frisbee, skis, snowboard, sports ball, kite, baseball bat, baseball glove, skateboard, surfboard, tennis racket

**Household Items:**
book, clock, vase, scissors, teddy bear, hair drier, toothbrush

## Tips for Best Results

1. **Good Lighting** - Well-lit images work best
2. **Clear Objects** - Avoid extreme blur or occlusion
3. **Multiple Objects** - Test the multi-label capability!
4. **Varied Scenes** - Try indoor, outdoor, urban, nature
5. **Adjust Threshold** - Lower threshold (0.3) finds more objects, higher (0.7) is more confident

## Troubleshooting

**No objects detected?**
- Try lowering the threshold to 0.3
- Make sure the image contains COCO classes
- Check image quality and lighting

**Too many false positives?**
- Increase threshold to 0.6 or 0.7
- Use larger model (yolov8l or yolov8x)

**Slow inference?**
- Use smaller model (yolov8n or yolov8s)
- Install GPU version of PyTorch
- Reduce image resolution
