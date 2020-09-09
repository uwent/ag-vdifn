export default interface DateRangeInterface {
    startDate(): Date;
    endDate(): Date;
    startDateAsString(): string;
    endDateAsString(): string;
    startDateValue(): string;
    endDateValue(): string;
    getMinForStartDateInput(): string;
    getMaxForStartDateInput(): string;
    getMinForEndDateInput(): string;
    getMaxForEndDateInput(): string;
    setMinForStartDateInput(date: Date): void;
    setMaxForStartDateInput(date: Date): void;
    setMinForEndDateInput(date: Date): void;
    setMaxForEndDateInput(date: Date): void;
    disableEndDate(): void;
    enableEndDate(): void;
    setStartDate(date: Date): void;
    setEndDate(date: Date): void;
}

