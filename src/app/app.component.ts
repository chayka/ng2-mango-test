import { Component, ViewChild } from '@angular/core';
import { DataTableComponent } from './data-table/data-table.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    title = 'app works!';
    url = '/api/data.json';
    query = '';

    @ViewChild(DataTableComponent)
    table: DataTableComponent;

    loadData() {
        this.table.load().catch(err => console.log(err));
    }
}
