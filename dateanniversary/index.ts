import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class dateanniversary
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _selectedDate: Date | null = null;
  private _age: number | null = null;
  private _upcomingAnniversary: Date | null = null;
  private _container: HTMLDivElement;
  private _ageElement: HTMLDivElement;
  private _anniversaryElement: HTMLDivElement;
  private datePicker: HTMLInputElement;
  private _notifyOutputChanged: () => void;

  constructor() {}

  public eventListner(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this._selectedDate = inputElement.valueAsDate;

    this._notifyOutputChanged();
  }
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._notifyOutputChanged = notifyOutputChanged;
    this._container = container;

    this._selectedDate = context.parameters.sampleProperty.raw || null;

    this.datePicker = document.createElement("input");
    this.datePicker.type = "date";
    this.datePicker.valueAsDate = this._selectedDate;
    this.datePicker.addEventListener("change", this.eventListner.bind(this));

    this._ageElement = document.createElement("div");
    this._anniversaryElement = document.createElement("div");

    container.appendChild(this.datePicker);
    container.appendChild(this._ageElement);
    container.appendChild(this._anniversaryElement);
  }

  private calculateAgeAndAnniversary(): void {
    if (this._selectedDate !== null) {
      const today = new Date();
      const birthDate = new Date(this._selectedDate);
      const years = today.getFullYear() - birthDate.getFullYear();
      const birthMonth = birthDate.getMonth();
      const todayMonth = today.getMonth();

      const age =
        todayMonth < birthMonth ||
        (todayMonth === birthMonth && today.getDate() < birthDate.getDate())
          ? years - 1
          : years;

      this._ageElement.textContent = `Age: ${age} years`;

      const upcomingAnniversaryDate = new Date(
        today.getFullYear(),
        birthMonth,
        birthDate.getDate()
      );
      if (today > upcomingAnniversaryDate) {
        upcomingAnniversaryDate.setFullYear(
          upcomingAnniversaryDate.getFullYear() + 1
        );
      }

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const formattedDate = `${
        monthNames[upcomingAnniversaryDate.getMonth()]
      } ${upcomingAnniversaryDate.getDate()}, ${upcomingAnniversaryDate.getFullYear()}`;

      this._anniversaryElement.textContent = `Upcoming Anniversary: ${formattedDate}`;
    } else {
      this._ageElement.textContent = "";
      this._anniversaryElement.textContent = "";
    }
  }
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._selectedDate = context.parameters.sampleProperty.raw || null;
    this.datePicker.valueAsDate = this._selectedDate;
    this.calculateAgeAndAnniversary();
  }

  public getOutputs(): IOutputs {
    const outputs: IOutputs = {
      sampleProperty:
        this._selectedDate !== null ? this._selectedDate : undefined,
      // ... Other properties ...
    };

    return outputs;
  }

  public destroy(): void {
    // Cleanup code if necessary
  }
}
