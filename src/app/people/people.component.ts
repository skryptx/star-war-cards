import { Component, input, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { People } from '../interfaces/people.interface';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss',
})
export class PeopleComponent {
  public order = input<number>();
  public onExpand = output<number>();

  protected _character: People | undefined;
  protected _isExpanded = false;

  @Input() public set character(val: any) {
    this._character = val;
  }

  @Input() public set isExpanded(val: boolean) {
    this._isExpanded = val;
  }

  protected toggleBody(): void {
    this._isExpanded = !this._isExpanded;

    if (this._isExpanded) {
      this.onExpand.emit(this.order() ?? 0);
    }
  }
}
