import {
	Component,
	Input,
	ContentChildren,
	QueryList,
	AfterContentInit,
	TemplateRef
} from "@angular/core";

import { BreadcrumbItem } from "./breadcrumb-item.interface";
import { BreadcrumbItemComponent } from "./breadcrumb-item.component";

const MINIMUM_OVERFLOW_THRESHOLD = 4;

/**
 *  [See demo](../../?path=/story/breadcrumb--basic)
 *
 * <example-url>../../iframe.html?id=breadcrumb--basic</example-url>
 */
@Component({
	selector: "ibm-breadcrumb",
	template: `
	<nav #nav class="bx--breadcrumb"
		[ngClass]="{
			'bx--skeleton' : skeleton,
			'bx--breadcrumb--no-trailing-slash' : noTrailingSlash
		}"
		[attr.aria-label]="ariaLabel">
		<ng-template [ngIf]="shouldShowContent">
			<ng-content></ng-content>
		</ng-template>
		<ng-template [ngIf]="!shouldShowOverflow">
			<ibm-breadcrumb-item
				*ngFor="let item of items"
				[href]="item.href"
				[current]="item.current"
				[ariaCurrent]="item.ariaCurrent">
				<ng-container *ngIf="!item.template">{{item.content}}</ng-container>
				<ng-template
					*ngIf="item.template"
					[ngTemplateOutlet]="item.template"
					[ngTemplateOutletContext]="{ $implicit: item }">
				</ng-template>
			</ibm-breadcrumb-item>
		</ng-template>
		<ng-template [ngIf]="shouldShowOverflow">
			<ibm-breadcrumb-item
				[href]="first?.href"
				[current]="first?.current"
				[ariaCurrent]="first?.ariaCurrent">
				<ng-container *ngIf="!first?.template">{{first?.content}}</ng-container>
				<ng-template
					*ngIf="first?.template"
					[ngTemplateOutlet]="first?.template"
					[ngTemplateOutletContext]="{ $implicit: first }">
				</ng-template>
			</ibm-breadcrumb-item>
			<ibm-breadcrumb-item>
				<ibm-overflow-menu>
					<li class="bx--overflow-menu-options__option"
						*ngFor="let item of overflowItems">
						<a class="bx--overflow-menu-options__btn"
							href="{{item?.href}}"
							style="text-decoration: none;">
							<ng-container *ngIf="!item?.template">{{item?.content}}</ng-container>
							<ng-template
								*ngIf="item?.template"
								[ngTemplateOutlet]="item?.template"
								[ngTemplateOutletContext]="{ $implicit: item }">
							</ng-template>
						</a>
					</li>
				</ibm-overflow-menu>
			</ibm-breadcrumb-item>
			<ibm-breadcrumb-item
				[href]="secondLast?.href"
				[current]="secondLast?.current"
				[ariaCurrent]="secondLast?.ariaCurrent">
				<ng-container *ngIf="!secondLast?.template">{{secondLast?.content}}</ng-container>
				<ng-template
					*ngIf="secondLast?.template"
					[ngTemplateOutlet]="secondLast?.template"
					[ngTemplateOutletContext]="{ $implicit: secondLast }">
				</ng-template>
			</ibm-breadcrumb-item>
			<ibm-breadcrumb-item
				[href]="last?.href"
				[current]="last?.current"
				[ariaCurrent]="last?.ariaCurrent">
				<ng-container *ngIf="!last?.template">{{last?.content}}</ng-container>
				<ng-template
					*ngIf="last?.template"
					[ngTemplateOutlet]="last?.template"
					[ngTemplateOutletContext]="{ $implicit: last }">
				</ng-template>
			</ibm-breadcrumb-item>
		</ng-template>
	</nav>`
})
export class Breadcrumb implements AfterContentInit {
	@ContentChildren(BreadcrumbItemComponent) children: QueryList<BreadcrumbItemComponent>;

	@Input() items: Array<BreadcrumbItem>;

	@Input() noTrailingSlash = false;

	@Input() ariaLabel: string;

	protected _threshold: number;
	protected _skeleton = false;

	@Input()
	set skeleton(value: any) {
		this._skeleton = value;
		this.updateChildren();
	}

	get skeleton(): any {
		return this._skeleton;
	}

	@Input()
	set threshold(threshold: number) {
		this._threshold = threshold;
		if (isNaN(threshold) || threshold < MINIMUM_OVERFLOW_THRESHOLD) {
			this._threshold = MINIMUM_OVERFLOW_THRESHOLD;
		}
	}

	get threshold(): number {
		return this._threshold;
	}

	ngAfterContentInit() {
		this.updateChildren();
	}

	get shouldShowContent(): boolean {
		return !this.items;
	}

	get shouldShowOverflow(): boolean {
		if (!this.items) {
			return false;
		}
		return this.items.length > this.threshold;
	}

	get first(): BreadcrumbItem {
		return this.shouldShowOverflow ? this.items[0] : null;
	}

	get overflowItems(): Array<BreadcrumbItem> {
		return this.shouldShowOverflow ? this.items.slice(1, this.items.length - 2) : [];
	}

	get secondLast(): BreadcrumbItem {
		return this.shouldShowOverflow ? this.items[this.items.length - 2] : null;
	}

	get last(): BreadcrumbItem {
		return this.shouldShowOverflow ? this.items[this.items.length - 1] : null;
	}

	protected updateChildren() {
		if (this.children) {
			this.children.toArray().forEach(child => child.skeleton = this.skeleton);
		}
	}
}
