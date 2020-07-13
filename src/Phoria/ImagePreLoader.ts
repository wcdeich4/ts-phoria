export default class ImagePreLoader {
    images: HTMLImageElement[] = [];

    callback: (loader: ImagePreLoader) => void = null;

    counter: number = 0;

    addImage(img: HTMLImageElement, url: string) {
        const el = img;
        el.dataset.url = url;
        // attach closure to the image onload handler
        el.onload = () => {
            this.counter += 1;
            if (this.counter === this.images.length) {
                // all images are loaded - execute callback function
                this.callback(this);
            }
        };
        this.images.push(el);
    }

    onLoadCallback(fn: (loader: ImagePreLoader) => void) {
        this.counter = 0;
        this.callback = fn;
        // load the images
        this.images.forEach((img) => {
            const image = img;
            image.src = img.dataset.url;
        });
    }
}
