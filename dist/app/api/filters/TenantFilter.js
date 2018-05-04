"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const back_lib_common_web_1 = require("back-lib-common-web");
const back_lib_common_util_1 = require("back-lib-common-util");
const { lazyInject } = back_lib_common_web_1.decorators;
class TenantFilter {
    get tenants() {
        return {
            'enron': '1111',
            'worldcom': '2222',
            'worris': '3333'
        };
    }
    resolveTenant(req, res, next) {
        console.log('Tenant policy!');
        const { tenant } = req.params;
        // TODO: Look up tenant id by name from db or cache
        if (this.tenants[tenant]) {
            req.params['tenantId'] = this.tenants[tenant];
            // throw new boom.badRequest('That company is evil!')
        }
        next();
    }
}
__decorate([
    lazyInject(back_lib_common_util_1.Types.DEPENDENCY_CONTAINER),
    __metadata("design:type", Object)
], TenantFilter.prototype, "_repo", void 0);
exports.TenantFilter = TenantFilter;
