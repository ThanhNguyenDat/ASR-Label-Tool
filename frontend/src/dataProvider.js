import { stringify } from "query-string";
import { fetchUtils } from "ra-core";
import { parseOperator } from "./helpers/common";

export default (apiUrl, httpClient = fetchUtils.fetchJson) => ({
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const filter = params.filter;

        const rangeStart = (page - 1) * perPage;
        const rangeEnd = page * perPage - 1;
        const filters = Object.keys(filter).map((key) => {
            const { property, operator, value } = parseOperator(key, filter[key]);
            return {
                field: property,
                operator: operator,
                value,
            };
        });

        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([rangeStart, rangeEnd]),
            filter: JSON.stringify(filters),
        };

        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => {
            return {
                data: json.data || json,
                total: parseInt(json.total) || 0,
            };
        });
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json.data || json,
        })),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json.data || json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const filter = params.filter;

        const rangeStart = (page - 1) * perPage;
        const rangeEnd = page * perPage - 1;
        const filters = Object.keys(filter).map((key) => {
            const { property, operator, value } = parseOperator(key, filter[key]);
            return {
                field: property,
                operator: operator,
                value,
            };
        });
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([rangeStart, rangeEnd]),
            filter: JSON.stringify(filters),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ headers, json }) => {
            return {
                data: json.data || json,
                total: parseInt(json.total) || 0,
            };
        });
    },

    getColumnNames: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/column_names`).then(({ json }) => ({
            data: json.data || json,
        })),

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "PUT",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json.data || json })),

    // simple-rest doesn't handle provide an updateMany route, so we fallback to calling update n times instead
    updateMany: (resource, params) =>
        Promise.all(
            params.ids.map((id) =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: "PUT",
                    body: JSON.stringify(params.data),
                })
            )
        ).then((responses) => ({ data: responses.map(({ json }) => json.data.id || json.id) })),

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: "POST",
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json.data || json })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: "DELETE",
            headers: new Headers({
                "Content-Type": "text/plain",
            }),
        }).then(({ json }) => ({ data: json.data || json })),

    // simple-rest doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
    deleteMany: (resource, params) =>
        Promise.all(
            params.ids.map((id) =>
                httpClient(`${apiUrl}/${resource}/${id}`, {
                    method: "DELETE",
                    headers: new Headers({
                        "Content-Type": "text/plain",
                    }),
                })
            )
        ).then((responses) => ({
            data: responses.map(({ json }) => json.data.id || json.id),
        })),

    updatePredict: (resource, params) => {
        // console.log("params: ", params);
        // console.log("resource: ", resource);
        return httpClient(`${apiUrl}/${resource}/update-predict`, params).then(({ json }) => ({
            data: json.data || json,
        }));
    },

    // export more data in big table to segments table
    exportMoreData: (resource, params) =>
        httpClient(`${apiUrl}/asr_label/export_to_segments`).then(({ json }) => ({
            data: json.data || json,
        })),
});
