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
    this.form.addEventListener("submit", this.handleSubmitEvent.bind(this));
  }

  private handleSubmitEvent(event: Event): void {
    event.preventDefault();
    if (!this.validateInput()) return;
    this.executeCallbacks();
  }

  private validateInput(): boolean {
    if (!this.areAnyCheckboxesChecked()) {
      this.reportNoCheckedCheckboxes();
      return false;
    }
    return true;
  }

  private areAnyCheckboxesChecked(): boolean {
    const checkboxes = this.getAllCheckboxes();
    return checkboxes.some((checkbox) => checkbox.checked);
  }

  private getAllCheckboxes(): HTMLInputElement[] {
    return Array.from(
      this.form.querySelectorAll("input[type=checkbox]")!,
    ) as HTMLInputElement[];
  }

  private reportNoCheckedCheckboxes(): void {
    const submitButton = this.getSubmitButton();
    submitButton.setCustomValidity("Please select at least one metric.");
    this.form.reportValidity();
    // If we don't reset the validity, the error message will show every time the
    // form is submitted, bypassing the submit handler.
    submitButton.setCustomValidity("");
  }

  private getSubmitButton(): HTMLButtonElement {
    return this.form.querySelector("button[type=submit]")!;
  }

  private addCallback(callback: FormCallback): void {
    this.callbacks.push(callback);
  }

  private executeCallbacks(): void {
    for (const callback of this.callbacks) {
      callback(new FormData(this.form));
    }
  }
}
