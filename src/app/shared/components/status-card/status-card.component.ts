import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatusCard {
  title: string;
  value: string;
  color?: string;
}

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-20 sm:h-24 lg:h-[81px] border border-[#d9d9d9] rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div class="flex justify-between h-full">
        <div class="p-3 sm:p-3.5 pt-8 sm:pt-10 lg:pt-12 flex-1">
          <span class="font-inter font-normal text-[#6d6d6d] text-xs sm:text-sm leading-tight">
            {{ card.title }}
          </span>
        </div>
        <div class="w-12 sm:w-14 lg:w-[49px] h-full border-l border-[#d9d9d9] flex items-center justify-center">
          <span class="font-inter font-bold text-[#6d6d6d] text-xs sm:text-sm">
            {{ card.value }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class StatusCardComponent {
  @Input() card!: StatusCard;
}