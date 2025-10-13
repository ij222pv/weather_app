type FormCallback = (formData: FormData) => void;

export default class FormHandler {
  private form: HTMLFormElement;
  private callbacks: FormCallback[] = [];

  public constructor() {
    this.setForm(document.querySelector("#trend-form"));
  }

  public onSubmit(callback: FormCallback): void {
    this.addCallback(callback);
  }

  private setForm(form: HTMLFormElement | null): void {
    this.assertIsForm(form);
    this.form = form;
    this.attachEventListener();
  }

  private assertIsForm(
    form: HTMLFormElement | null,
  ): asserts form is HTMLFormElement {
    if (form !== null && form instanceof HTMLFormElement) {
      return;
    }
    throw new TypeError("Element is not a form");
  }

  private attachEventListener(): void {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(this.form);
      this.executeCallbacks(formData);
    });
  }

  private addCallback(callback: FormCallback): void {
    this.callbacks.push(callback);
  }

  private executeCallbacks(formData: FormData): void {
    for (const callback of this.callbacks) {
      callback(formData);
    }
  }
}
