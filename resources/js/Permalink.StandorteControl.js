/**
 * This file is licensed under Creative Commons Zero (CC0)
 * http://creativecommons.org/publicdomain/zero/1.0/
 * Author: http://www.openstreetmap.org/user/Zartbitter
 */

L.Control.Permalink.include({

	initialize_standortecontrol: function() {
		this.on('update', this._set_standortecontrol, this);
		this.on('add', this._onadd_standortecontrol, this);
	},

	_onadd_standortecontrol: function(e) {
		this._map.on('standortecontrolchanged', this._update_standortecontrol, this);
		this._update_standortecontrol();
	},

	_update_standortecontrol: function() {
		var bcopt = this.options.standorteControl.options;
		var params = { r1: bcopt.r1, r2: bcopt.r2 };

		if (bcopt.mlat && bcopt.mlon && (bcopt.m || bcopt.c1 || bcopt.c2)) {
			var position = this._round_point(L.latLng([bcopt.mlat, bcopt.mlon]))
			params.mlat = position.lat;
			params.mlon = position.lng;
			if (bcopt.m) {
				params.m = 1;
			} else {
				params.m = null;
			}
			if (bcopt.c1) {
				params.c1 = 1;
			} else {
				params.c1 = null;
			}
			if (bcopt.c2) {
				params.c2 = 1;
			} else {
				params.c2 = null;
			}
		} else {
			params.mlat = null;
			params.mlon = null;
			params.m = null;
			params.c1 = null;
			params.c2 = null;
		}

		this._update(params);
	},

	_set_standortecontrol: function(e) {
		this._map.fire("_update_standortecontrol", {params: this._params});
	}
});

