export default class ImagePreLoader {
    images: HTMLImageElement[] = [];

    callback: ((loader: ImagePreLoader) => void) | null = null;

    errorCallback: ((file: string) => void) | null = null;

    counter = 0;

    addImage(img: HTMLImageElement, url: string): void {
        const el = img;
        el.dataset.url = url;
        // attach closure to the image onload handler
        el.onload = () => {
            this.counter += 1;
            if (this.counter === this.images.length) {
                // all images are loaded - execute callback function
                if (!this.callback) {
                    return;
                }
                this.callback(this);
            }
        };
        el.onerror = () => {
            if (this.errorCallback) {
                this.errorCallback(url);
            }
        };
        this.images.push(el);
    }

    onLoadCallback(fn: (loader: ImagePreLoader) => void): void {
        this.counter = 0;
        this.callback = fn;
        // load the images
        this.images.forEach((img) => {
            const image = img;
            if (!img.dataset.url) {
                return;
            }
            image.src = img.dataset.url;
        });
    }
}
