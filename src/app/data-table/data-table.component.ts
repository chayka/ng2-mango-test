import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.less']
})
export class DataTableComponent implements OnInit {

    /**
     * Data container
     */
    data: any[];

    /**
     * Cache to store sorted data and search results
     */
    cache: any[];

    /**
     * Array of field names
     */
    fields: Object = {};

    /**
     * Field name to order data by
     */
    orderBy: string;

    /**
     * Flag to designate order direction
     */
    orderAsc: boolean;

    /**
     * Search query property
     */
    @Input() query: string;

    /**
     * Data url property
     */
    @Input() url: string;

    /**
     * Constructor
     *
     * @param http
     */
    constructor(private http: Http) {
    }

    /**
     * Init
     */
    ngOnInit() {
        this.load().catch((err) => console.error(err));
    }

    /**
     * Load data from external source
     * @return {any}
     */
    load(): Promise<Object[]> {
        return this.url ? this.http
                .get(this.url)
                .toPromise()
                .then(response => {

                    return this.setData(response.json().payload);

                }).catch(response => {
                    this.setData(null);

                    return response.statusText;
                }) :
            Promise.reject('No url specified');
    }

    /**
     * Set table data
     * @param data
     * @return {any[]}
     */
    setData(data: Object[]): Object[] {
        this.data = data;
        this.fields = {};
        this.cache = null;

        /**
         * Detect data types of each column
         */
        (data || []).forEach(row => {
            Object.keys(row).forEach(field => this.fields[field] = row[field] !== undefined && typeof row[field]);
        });

        /**
         * Set order by to first column asc automatically
         * @type {string}
         */
        this.orderBy = Object.keys(this.fields)[0] || '';
        this.orderAsc = true;

        return this.data;
    }

    /**
     * Get data filtered and sorted, store result to cache
     *
     * @return {any[]}
     */
    getData(): any[] {
        let query = (this.query || '').toLowerCase();
        return this.cache = (this.data || [])
            /**
             * Filter searched data
             */
            .filter(item => {
                if (this.query) {
                    return !!Object.keys(item)
                        .find(key => item[key].toString().toLowerCase().indexOf(query) >= 0);
                }
                return true;
            })
            /**
             * Sort data according to controls
             */
            .sort((a: any, b: any) => {
                let va = a[this.orderBy];
                let vb = b[this.orderBy];
                switch (this.fields[this.orderBy]){
                    case 'number':
                        va = va || 0;
                        vb = vb || 0;
                        break;
                    case 'string':
                        va = va || '';
                        vb = vb || '';
                        break;
                }
                if (va > vb) {
                    return this.orderAsc ? 1 : -1;
                } else if (va < vb) {
                    return this.orderAsc ? -1 : 1;
                }
                return 0;
            });
    }

    /**
     * Get field names
     *
     * @return {string[]}
     */
    getFields() {
        return Object.keys(this.fields);
    }

    /**
     * Set sorting params
     *
     * @param orderBy
     * @param orderAsc
     */
    setOrder(orderBy, orderAsc) {
        this.orderBy = orderBy;
        this.orderAsc = orderAsc;
    }
}
