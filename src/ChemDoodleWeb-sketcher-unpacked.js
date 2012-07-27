//
// ChemDoodle Web Components 4.7.0
//
// http://web.chemdoodle.com
//
// Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// As a special exception to the GPL, any HTML file in a public website
// or any free web service which merely makes function calls to this
// code, and for that purpose includes it by reference, shall be deemed
// a separate work for copyright law purposes. If you modify this code,
// you may extend this exception to your version of the code, but you
// are not obligated to do so. If you do not wish to do so, delete this
// exception statement from your version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// Please contact iChemLabs <http://www.ichemlabs.com/contact> for
// alternate licensing options.
//

//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2974 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-29 11:07:06 -0500 (Wed, 29 Dec 2010) $
//
ChemDoodle.sketcher = (function() {

	var p = {};

	p.actions = {};
	p.gui = {};
	p.gui.desktop = {};
	p.gui.mobile = {};
	p.states = {};

	return p;

})();
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(actions) {

	actions._Action = function() {
		this.forward = function(sketcher) {
			this.innerForward();
			this.checks(sketcher);
		};
		this.reverse = function(sketcher) {
			this.innerReverse();
			this.checks(sketcher);
		};
		this.checks = function(sketcher) {
			sketcher.molecule.check();
			sketcher.repaint();
		};
		return true;
	};

})(ChemDoodle.sketcher.actions);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3103 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-20 12:58:08 -0500 (Sun, 20 Feb 2011) $
//

(function(actions, inArray) {

	actions.AddAction = function(mol, as, bs) {
		this.mol = mol;
		this.as = as;
		this.bs = bs;
		return true;
	};
	actions.AddAction.prototype = new actions._Action();
	actions.AddAction.prototype.innerForward = function() {
		if (this.as != null) {
			for ( var i = 0, ii = this.as.length; i < ii; i++) {
				this.mol.atoms.push(this.as[i]);
			}
		}
		if (this.bs != null) {
			for ( var i = 0, ii = this.bs.length; i < ii; i++) {
				this.mol.bonds.push(this.bs[i]);
			}
		}
	};
	actions.AddAction.prototype.innerReverse = function() {
		if (this.as != null) {
			var aKeep = [];
			for ( var i = 0, ii = this.mol.atoms.length; i < ii; i++) {
				if (inArray(this.mol.atoms[i], this.as) == -1) {
					aKeep.push(this.mol.atoms[i]);
				}
			}
			this.mol.atoms = aKeep;
		}
		if (this.bs != null) {
			var bKeep = [];
			for ( var i = 0, ii = this.mol.bonds.length; i < ii; i++) {
				if (inArray(this.mol.bonds[i], this.bs) == -1) {
					bKeep.push(this.mol.bonds[i]);
				}
			}
			this.mol.bonds = bKeep;
		}
	};

})(ChemDoodle.sketcher.actions, jQuery.inArray);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(actions, Bond) {

	actions.ChangeBondAction = function(b, orderAfter, stereoAfter) {
		this.b = b;
		this.orderBefore = b.bondOrder;
		this.stereoBefore = b.stereo;
		if (orderAfter) {
			this.orderAfter = orderAfter;
			this.stereoAfter = stereoAfter;
		} else {
			this.orderAfter = b.bondOrder + 1;
			if (this.orderAfter > 3) {
				this.orderAfter = 1;
			}
			this.stereoAfter = Bond.STEREO_NONE;
		}
		return true;
	};
	actions.ChangeBondAction.prototype = new actions._Action();
	actions.ChangeBondAction.prototype.innerForward = function() {
		this.b.bondOrder = this.orderAfter;
		this.b.stereo = this.stereoAfter;
	};
	actions.ChangeBondAction.prototype.innerReverse = function() {
		this.b.bondOrder = this.orderBefore;
		this.b.stereo = this.stereoBefore;
	};

})(ChemDoodle.sketcher.actions, ChemDoodle.structures.Bond);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(actions) {

	actions.ChangeChargeAction = function(a, delta) {
		this.a = a;
		this.delta = delta;
		return true;
	};
	actions.ChangeChargeAction.prototype = new actions._Action();
	actions.ChangeChargeAction.prototype.innerForward = function() {
		this.a.charge += this.delta;
	};
	actions.ChangeChargeAction.prototype.innerReverse = function() {
		this.a.charge -= this.delta;
	};

})(ChemDoodle.sketcher.actions);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2977 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-29 19:11:54 -0500 (Wed, 29 Dec 2010) $
//
(function(actions) {

	actions.ChangeCoordinatesAction = function(as, newCoords) {
		this.as = as;
		this.recs = [];
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			this.recs[i] = {'xo':this.as[i].x, 'yo':this.as[i].y, 'xn':newCoords[i].x, 'yn':newCoords[i].y};
		}
		return true;
	};
	actions.ChangeCoordinatesAction.prototype = new actions._Action();
	actions.ChangeCoordinatesAction.prototype.innerForward = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			this.as[i].x = this.recs[i].xn;
			this.as[i].y = this.recs[i].yn;
		}
	};
	actions.ChangeCoordinatesAction.prototype.innerReverse = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			this.as[i].x = this.recs[i].xo;
			this.as[i].y = this.recs[i].yo;
		}
	};

})(ChemDoodle.sketcher.actions);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(actions) {

	actions.ChangeLabelAction = function(a, after) {
		this.a = a;
		this.before = a.label;
		this.after = after;
		return true;
	};
	actions.ChangeLabelAction.prototype = new actions._Action();
	actions.ChangeLabelAction.prototype.innerForward = function() {
		this.a.label = this.after;
	};
	actions.ChangeLabelAction.prototype.innerReverse = function() {
		this.a.label = this.before;
	};

})(ChemDoodle.sketcher.actions);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(actions) {

	actions.ChangeLonePairAction = function(a, delta) {
		this.a = a;
		this.delta = delta;
		return true;
	};
	actions.ChangeLonePairAction.prototype = new actions._Action();
	actions.ChangeLonePairAction.prototype.innerForward = function() {
		this.a.numLonePair += this.delta;
	};
	actions.ChangeLonePairAction.prototype.innerReverse = function() {
		this.a.numLonePair -= this.delta;
	};

})(ChemDoodle.sketcher.actions);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(actions) {

	actions.ClearAction = function(sketcher) {
		this.sketcher = sketcher;
		this.before = this.sketcher.getMolecule();
		this.sketcher.clear();
		this.after = this.sketcher.getMolecule();
		return true;
	};
	actions.ClearAction.prototype = new actions._Action();
	actions.ClearAction.prototype.innerForward = function() {
		this.sketcher.molecule = this.after;
	};
	actions.ClearAction.prototype.innerReverse = function() {
		this.sketcher.molecule = this.before;
	};

})(ChemDoodle.sketcher.actions);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(actions) {

	actions.DeleteAction = function(mol, as, bs) {
		this.mol = mol;
		this.as = as;
		this.bs = bs;
		return true;
	};
	actions.DeleteAction.prototype = new actions._Action();
	actions.DeleteAction.prototype.innerForward = actions.AddAction.prototype.innerReverse;
	actions.DeleteAction.prototype.innerReverse = actions.AddAction.prototype.innerForward;

})(ChemDoodle.sketcher.actions);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(actions) {

	actions.FlipBondAction = function(b) {
		this.b = b;
		return true;
	};
	actions.FlipBondAction.prototype = new actions._Action();
	actions.FlipBondAction.prototype.innerForward = function() {
		var temp = this.b.a1;
		this.b.a1 = this.b.a2;
		this.b.a2 = temp;
	};
	actions.FlipBondAction.prototype.innerReverse = function() {
		this.innerForward();
	};

})(ChemDoodle.sketcher.actions);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(actions) {

	actions.MoveAction = function(as, dif) {
		this.as = as;
		this.dif = dif;
		return true;
	};
	actions.MoveAction.prototype = new actions._Action();
	actions.MoveAction.prototype.innerForward = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			this.as[i].add(this.dif);
		}
	};
	actions.MoveAction.prototype.innerReverse = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			this.as[i].sub(this.dif);
		}
	};

})(ChemDoodle.sketcher.actions);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2942 $
//  $Author: jat $
//  $LastChangedDate: 2010-12-20 20:56:27 -0500 (Mon, 20 Dec 2010) $
//
(function(actions, m) {

	actions.RotateAction = function(as, dif, center) {
		this.as = as;
		this.dif = dif;
		this.center = center;
		return true;
	};
	actions.RotateAction.prototype = new actions._Action();
	actions.RotateAction.prototype.innerForward = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			var dist = this.center.distance(this.as[i]);
			var angle = this.center.angle(this.as[i]) + this.dif;
			this.as[i].x = this.center.x + dist * m.cos(angle);
			this.as[i].y = this.center.y - dist * m.sin(angle);
		}
	};
	actions.RotateAction.prototype.innerReverse = function() {
		for ( var i = 0, ii = this.as.length; i < ii; i++) {
			var dist = this.center.distance(this.as[i]);
			var angle = this.center.angle(this.as[i]) - this.dif;
			this.as[i].x = this.center.x + dist * m.cos(angle);
			this.as[i].y = this.center.y - dist * m.sin(angle);
		}
	};

})(ChemDoodle.sketcher.actions, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2977 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-29 19:11:54 -0500 (Wed, 29 Dec 2010) $
//

(function(actions, inArray) {

	actions.SwitchMoleculeAction = function(sketcher, mol) {
		this.sketcher = sketcher;
		this.molB = sketcher.molecule;
		this.molA = mol;
		return true;
	};
	actions.SwitchMoleculeAction.prototype = new actions._Action();
	actions.SwitchMoleculeAction.prototype.innerForward = function() {
		this.sketcher.loadMolecule(this.molA);
	};
	actions.SwitchMoleculeAction.prototype.innerReverse = function() {
		this.sketcher.molecule = this.molB;
	};

})(ChemDoodle.sketcher.actions, jQuery.inArray);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(actions) {

	actions.HistoryManager = function(sketcher) {
		this.sketcher = sketcher;
		this.undoStack = [];
		this.redoStack = [];
		return true;
	};
	actions.HistoryManager.prototype.undo = function() {
		if (this.undoStack.length != 0) {
			var a = this.undoStack.pop();
			a.reverse(this.sketcher);
			this.redoStack.push(a);
			if (this.undoStack.length == 0) {
				this.sketcher.toolbarManager.buttonUndo.disable();
			}
			this.sketcher.toolbarManager.buttonRedo.enable();
		}
	};
	actions.HistoryManager.prototype.redo = function() {
		if (this.redoStack.length != 0) {
			var a = this.redoStack.pop();
			a.forward(this.sketcher);
			this.undoStack.push(a);
			this.sketcher.toolbarManager.buttonUndo.enable();
			if (this.redoStack.length == 0) {
				this.sketcher.toolbarManager.buttonRedo.disable();
			}
		}
	};
	actions.HistoryManager.prototype.pushUndo = function(a) {
		a.forward(this.sketcher);
		this.undoStack.push(a);
		if (this.redoStack.length != 0) {
			this.redoStack = [];
		}
		this.sketcher.toolbarManager.buttonUndo.enable();
		this.sketcher.toolbarManager.buttonRedo.disable();
	};
	actions.HistoryManager.prototype.clear = function(a) {
		if (this.undoStack.length != 0) {
			this.undoStack = [];
			this.sketcher.toolbarManager.buttonUndo.disable();
		}
		if (this.redoStack.length != 0) {
			this.redoStack = [];
			this.sketcher.toolbarManager.buttonRedo.disable();
		}
	};

})(ChemDoodle.sketcher.actions);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3472 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-27 16:16:37 -0500 (Fri, 27 Jan 2012) $
//

(function(math, monitor, actions, states, structures, SYMBOLS, inArray, m) {

	states._State = function() {
		return true;
	};
	states._State.prototype.setup = function(sketcher) {
		this.sketcher = sketcher;
	};

	states._State.prototype.bondExists = function(a1, a2) {
		for ( var j = 0, jj = this.sketcher.molecule.bonds.length; j < jj; j++) {
			if (this.sketcher.molecule.bonds[j].contains(a1) && this.sketcher.molecule.bonds[j].contains(a2)) {
				return true;
			}
		}
		return false;
	};
	states._State.prototype.getBond = function(a1, a2) {
		for ( var j = 0, jj = this.sketcher.molecule.bonds.length; j < jj; j++) {
			if (this.sketcher.molecule.bonds[j].contains(a1) && this.sketcher.molecule.bonds[j].contains(a2)) {
				return this.sketcher.molecule.bonds[j];
			}
		}
		return null;
	};
	states._State.prototype.clearHover = function() {
		if (this.sketcher.hovering != null) {
			this.sketcher.hovering.isHover = false;
			this.sketcher.hovering.isSelected = false;
		}
		this.sketcher.hovering = null;
	};
	states._State.prototype.findHoveredObject = function(e, includeAtoms, includeBonds) {
		this.clearHover();
		var min = Infinity;
		var hovering = null;
		if (includeAtoms) {
			for ( var i = 0, ii = this.sketcher.molecule.atoms.length; i < ii; i++) {
				this.sketcher.molecule.atoms[i].isHover = false;
				var dist = e.p.distance(this.sketcher.molecule.atoms[i]);
				if (dist < this.sketcher.specs.bondLength && dist < min) {
					min = dist;
					hovering = this.sketcher.molecule.atoms[i];
				}
			}
		}
		if (includeBonds) {
			for ( var i = 0, ii = this.sketcher.molecule.bonds.length; i < ii; i++) {
				this.sketcher.molecule.bonds[i].isHover = false;
				var dist = e.p.distance(this.sketcher.molecule.bonds[i].getCenter());
				if (dist < this.sketcher.specs.bondLength && dist < min) {
					min = dist;
					hovering = this.sketcher.molecule.bonds[i];
				}
			}
		}
		if (hovering != null) {
			hovering.isHover = true;
			this.sketcher.hovering = hovering;
		}
	};
	states._State.prototype.getOptimumAngle = function(a) {
		var angles = this.sketcher.molecule.getAngles(a);
		var angle = 0;
		if (angles.length == 0) {
			angle = m.PI / 6;
		} else if (angles.length == 1) {
			var b = null;
			for ( var j = 0, jj = this.sketcher.molecule.bonds.length; j < jj; j++) {
				if (this.sketcher.molecule.bonds[j].contains(this.sketcher.hovering)) {
					b = this.sketcher.molecule.bonds[j];
				}
			}
			if (b.bondOrder >= 3) {
				angle = angles[0] + m.PI;
			} else {
				var concerned = angles[0] % m.PI * 2;
				if (math.isBetween(concerned, 0, m.PI / 2) || math.isBetween(concerned, m.PI, 3 * m.PI / 2)) {
					angle = angles[0] + 2 * m.PI / 3;
				} else {
					angle = angles[0] - 2 * m.PI / 3;
				}
			}

		} else {
			angle = math.angleBetweenLargest(angles).angle;
		}
		return angle;
	};

	states._State.prototype.click = function(e) {
		if (this.innerclick) {
			this.innerclick(e);
		}
	};
	states._State.prototype.rightclick = function(e) {
		if (this.innerrightclick) {
			this.innerrightclick(e);
		}
	};
	states._State.prototype.dblclick = function(e) {
		if (this.innerdblclick) {
			this.innerdblclick(e);
		}
		if (this.sketcher.hovering == null) {
			// center structure
			var dif = new structures.Point(this.sketcher.width / 2, this.sketcher.height / 2);
			dif.sub(this.sketcher.molecule.getCenter());
			this.sketcher.historyManager.pushUndo(new actions.MoveAction(this.sketcher.molecule.atoms, dif));
		}
	};
	states._State.prototype.mousedown = function(e) {
		this.sketcher.lastPoint = e.p;
		if (this.sketcher.isHelp || this.sketcher.isMobile && e.op.distance(this.sketcher.helpPos) < 10) {
			this.sketcher.isHelp = false;
			this.sketcher.repaint();
			window.open('http://web.chemdoodle.com/sketcher');
		} else if (this.innermousedown) {
			this.innermousedown(e);
		}
	};
	states._State.prototype.rightmousedown = function(e) {
		if (this.innerrightmousedown) {
			this.innerrightmousedown(e);
		}
	};
	states._State.prototype.mousemove = function(e) {
		if (this.innermousemove) {
			this.innermousemove(e);
		}
		//call the repaint here to repaint the help button, also this is called by other functions, so the repaint must be here
		this.sketcher.repaint();
	};
	states._State.prototype.mouseout = function(e) {
		if (this.innermouseout) {
			this.innermouseout(e);
		}
	};
	states._State.prototype.mouseover = function(e) {
		if (this.innermouseover) {
			this.innermouseover(e);
		}
	};
	states._State.prototype.mouseup = function(e) {
		this.parentAction = null;
		if (this.innermouseup) {
			this.innermouseup(e);
		}
	};
	states._State.prototype.rightmouseup = function(e) {
		if (this.innerrightmouseup) {
			this.innerrightmouseup(e);
		}
	};
	states._State.prototype.mousewheel = function(e, delta) {
		if (this.innermousewheel) {
			this.innermousewheel(e);
		}
		this.sketcher.specs.scale += delta / 10;
		this.sketcher.checkScale();
		this.sketcher.repaint();
	};
	states._State.prototype.drag = function(e) {
		if (this.innerdrag) {
			this.innerdrag(e);
		}
		if (this.sketcher.hovering == null) {
			if (monitor.SHIFT) {
				// rotate structure
				var center = new structures.Point(this.sketcher.width / 2, this.sketcher.height / 2);
				var oldAngle = center.angle(this.sketcher.lastPoint);
				var newAngle = center.angle(e.p);
				var rot = newAngle - oldAngle;
				if (this.parentAction == null) {
					this.parentAction = new actions.RotateAction(this.sketcher.molecule.atoms, rot, center);
					this.sketcher.historyManager.pushUndo(this.parentAction);
				} else {
					this.parentAction.dif += rot;
					for ( var i = 0, ii = this.sketcher.molecule.atoms.length; i < ii; i++) {
						var dist = center.distance(this.sketcher.molecule.atoms[i]);
						var angle = center.angle(this.sketcher.molecule.atoms[i]) + rot;
						this.sketcher.molecule.atoms[i].x = center.x + dist * m.cos(angle);
						this.sketcher.molecule.atoms[i].y = center.y - dist * m.sin(angle);
					}
					// must check here as change is outside of an action
					this.sketcher.molecule.check();
				}
			} else {
				if(!this.sketcher.lastPoint){
					// this prevents the structure from being rotated and translated at the same time while a gesture is occuring, which is preferable based on use cases since the rotation center is the canvas center
					return;
				}
				// move structure
				var dif = new structures.Point(e.p.x, e.p.y);
				dif.sub(this.sketcher.lastPoint);
				if (this.parentAction == null) {
					this.parentAction = new actions.MoveAction(this.sketcher.molecule.atoms, dif);
					this.sketcher.historyManager.pushUndo(this.parentAction);
				} else {
					this.parentAction.dif.add(dif);
					for ( var i = 0, ii = this.sketcher.molecule.atoms.length; i < ii; i++) {
						this.sketcher.molecule.atoms[i].add(dif);
					}
					// must check here as change is outside of an action
					this.sketcher.molecule.check();
				}
			}
			this.sketcher.repaint();
		}
		this.sketcher.lastPoint = e.p;
	};
	states._State.prototype.keydown = function(e) {
		if (monitor.CANVAS_DRAGGING == this.sketcher) {
			if (this.sketcher.lastPoint != null) {
				e.p = this.sketcher.lastPoint;
				this.drag(e);
			}
		} else if (monitor.META) {
			if (e.which == 90) {
				// z
				this.sketcher.historyManager.undo();
			} else if (e.which == 89) {
				// y
				this.sketcher.historyManager.redo();
			} else if (e.which == 83) {
				// s
				this.sketcher.toolbarManager.buttonSave.getElement().click();
			} else if (e.which == 79) {
				// o
				this.sketcher.toolbarManager.buttonOpen.getElement().click();
			} else if (e.which == 78) {
				// n
				this.sketcher.toolbarManager.buttonClear.getElement().click();
			} else if (e.which == 187 || e.which==61) {
				// +
				this.sketcher.toolbarManager.buttonScalePlus.getElement().click();
			} else if (e.which == 189 || e.which==109) {
				// -
				this.sketcher.toolbarManager.buttonScaleMinus.getElement().click();
			}
		} else if (e.which >= 37 && e.which <= 40) {
			// arrow keys
			var dif = new structures.Point();
			switch (e.which) {
			case 37:
				dif.x = -10;
				break;
			case 38:
				dif.y = -10;
				break;
			case 39:
				dif.x = 10;
				break;
			case 40:
				dif.y = 10;
				break;
			}
			this.sketcher.historyManager.pushUndo(new actions.MoveAction(this.sketcher.molecule.atoms, dif));
		} else if (e.which == 187 || e.which == 189 || e.which==61 || e.which==109) {
			// plus or minus
			if (this.sketcher.hovering != null && this.sketcher.hovering instanceof structures.Atom) {
				this.sketcher.historyManager.pushUndo(new actions.ChangeChargeAction(this.sketcher.hovering, e.which == 187 || e.which == 61 ? 1 : -1));
			}
		} else if (e.which == 8 || e.which == 127) {
			// delete or backspace
			this.sketcher.stateManager.STATE_ERASE.handleDelete();
		} else if (e.which >= 48 && e.which <= 57) {
			// digits
			if (this.sketcher.hovering != null) {
				var number = e.which - 48;
				var as = [];
				var bs = [];
				if (this.sketcher.hovering instanceof structures.Atom) {
					if (monitor.SHIFT) {
						if (number > 2 && number < 9) {
							var angles = this.sketcher.molecule.getAngles(this.sketcher.hovering);
							var angle = 3 * m.PI / 2;
							if (angles.length != 0) {
								angle = math.angleBetweenLargest(angles).angle;
							}
							var ring = this.sketcher.stateManager.STATE_NEW_RING.getRing(this.sketcher.hovering, number, this.sketcher.specs.bondLength, angle, false);
							if (inArray(ring[0], this.sketcher.molecule.atoms) == -1) {
								as.push(ring[0]);
							}
							if (!this.bondExists(this.sketcher.hovering, ring[0])) {
								bs.push(new structures.Bond(this.sketcher.hovering, ring[0]));
							}
							for ( var i = 1, ii = ring.length; i < ii; i++) {
								if (inArray(ring[i], this.sketcher.molecule.atoms) == -1) {
									as.push(ring[i]);
								}
								if (!this.bondExists(ring[i - 1], ring[i])) {
									bs.push(new structures.Bond(ring[i - 1], ring[i]));
								}
							}
							if (!this.bondExists(ring[ring.length - 1], this.sketcher.hovering)) {
								bs.push(new structures.Bond(ring[ring.length - 1], this.sketcher.hovering));
							}
						}
					} else {
						if (number == 0) {
							number = 10;
						}
						var p = new structures.Point(this.sketcher.hovering.x, this.sketcher.hovering.y);
						var a = this.getOptimumAngle(this.sketcher.hovering);
						var prev = this.sketcher.hovering;
						for ( var i = 0; i < number; i++) {
							var ause = a + (i % 2 == 1 ? m.PI / 3 : 0);
							p.x += this.sketcher.specs.bondLength * m.cos(ause);
							p.y -= this.sketcher.specs.bondLength * m.sin(ause);
							var use = new structures.Atom('C', p.x, p.y);
							var minDist = Infinity;
							var closest = null;
							for ( var j = 0, jj = this.sketcher.molecule.atoms.length; j < jj; j++) {
								var dist = this.sketcher.molecule.atoms[j].distance(use);
								if (dist < minDist) {
									minDist = dist;
									closest = this.sketcher.molecule.atoms[j];
								}
							}
							if (minDist < 5) {
								use = closest;
							} else {
								as.push(use);
							}
							if (!this.bondExists(prev, use)) {
								bs.push(new structures.Bond(prev, use));
							}
							prev = use;
						}
					}
				} else if (this.sketcher.hovering instanceof structures.Bond) {
					if (monitor.SHIFT) {
						if (number > 2 && number < 9) {
							var ring = this.sketcher.stateManager.STATE_NEW_RING.getOptimalRing(this.sketcher.hovering, number);
							var start = this.sketcher.hovering.a2;
							var end = this.sketcher.hovering.a1;
							if (ring[0] == this.sketcher.hovering.a1) {
								start = this.sketcher.hovering.a1;
								end = this.sketcher.hovering.a2;
							}
							if (inArray(ring[1], this.sketcher.molecule.atoms) == -1) {
								as.push(ring[1]);
							}
							if (!this.bondExists(start, ring[1])) {
								bs.push(new structures.Bond(start, ring[1]));
							}
							for ( var i = 2, ii = ring.length; i < ii; i++) {
								if (inArray(ring[i], this.sketcher.molecule.atoms) == -1) {
									as.push(ring[i]);
								}
								if (!this.bondExists(ring[i - 1], ring[i])) {
									bs.push(new structures.Bond(ring[i - 1], ring[i]));
								}
							}
							if (!this.bondExists(ring[ring.length - 1], end)) {
								bs.push(new structures.Bond(ring[ring.length - 1], end));
							}
						}
					} else if (number > 0 && number < 4) {
						this.sketcher.historyManager.pushUndo(new actions.ChangeBondAction(this.sketcher.hovering, number, structures.Bond.STEREO_NONE));
					}
				}
				if (as.length != 0 || bs.length != 0) {
					this.sketcher.historyManager.pushUndo(new actions.AddAction(this.sketcher.molecule, as, bs));
				}
			}
		} else if (e.which >= 65 && e.which <= 90) {
			// alphabet
			if (this.sketcher.hovering != null) {
				if (this.sketcher.hovering instanceof structures.Atom) {
					var check = String.fromCharCode(e.which);
					var firstMatch = null;
					var firstAfterMatch = null;
					var found = false;
					for ( var j = 0, jj = SYMBOLS.length; j < jj; j++) {
						if (this.sketcher.hovering.label.charAt(0) == check) {
							if (SYMBOLS[j] == this.sketcher.hovering.label) {
								found = true;
							} else if (SYMBOLS[j].charAt(0) == check) {
								if (found && firstAfterMatch == null) {
									firstAfterMatch = SYMBOLS[j];
								} else if (firstMatch == null) {
									firstMatch = SYMBOLS[j];
								}
							}
						} else {
							if (SYMBOLS[j].charAt(0) == check) {
								firstMatch = SYMBOLS[j];
								break;
							}
						}
					}
					var use = 'C';
					if (firstAfterMatch != null) {
						use = firstAfterMatch;
					} else if (firstMatch != null) {
						use = firstMatch;
					}
					this.sketcher.historyManager.pushUndo(new actions.ChangeLabelAction(this.sketcher.hovering, use));
				} else if (this.sketcher.hovering instanceof structures.Bond) {
					if (e.which == 70) {
						// f
						this.sketcher.historyManager.pushUndo(new actions.FlipBondAction(this.sketcher.hovering));
					}
				}
			}
		}
		if (this.innerkeydown) {
			this.innerkeydown(e);
		}
	};
	states._State.prototype.keypress = function(e) {
		if (this.innerkeypress) {
			this.innerkeypress(e);
		}
	};
	states._State.prototype.keyup = function(e) {
		if (monitor.CANVAS_DRAGGING == this.sketcher) {
			if (this.sketcher.lastPoint != null) {
				e.p = this.sketcher.lastPoint;
				this.sketcher.drag(e);
			}
		}
		if (this.innerkeyup) {
			this.innerkeyup(e);
		}
	};

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.sketcher.actions, ChemDoodle.sketcher.states, ChemDoodle.structures, ChemDoodle.SYMBOLS, jQuery.inArray, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(actions, states) {

	states.ChargeState = function(sketcher) {
		this.setup(sketcher);
		this.delta = 1;
		return true;
	};
	states.ChargeState.prototype = new states._State();
	states.ChargeState.prototype.innermouseup = function(e) {
		if (this.sketcher.hovering != null) {
			this.sketcher.historyManager.pushUndo(new actions.ChangeChargeAction(this.sketcher.hovering, this.delta));
		}
	};
	states.ChargeState.prototype.innermousemove = function(e) {
		this.findHoveredObject(e, true, false);
	};

})(ChemDoodle.sketcher.actions, ChemDoodle.sketcher.states);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3103 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-20 12:58:08 -0500 (Sun, 20 Feb 2011) $
//

(function(actions, states, structures, inArray) {

	states.EraseState = function(sketcher) {
		this.setup(sketcher);
		return true;
	};
	states.EraseState.prototype = new states._State();
	states.EraseState.prototype.handleDelete = function() {
		if (this.sketcher.hovering != null) {
			if (this.sketcher.hovering instanceof structures.Atom) {
				for ( var j = 0, jj = this.sketcher.molecule.atoms.length; j < jj; j++) {
					this.sketcher.molecule.atoms[j].visited = false;
				}
				var connectionsA = [];
				var connectionsB = [];
				this.sketcher.hovering.visited = true;
				for ( var j = 0, jj = this.sketcher.molecule.bonds.length; j < jj; j++) {
					if (this.sketcher.molecule.bonds[j].contains(this.sketcher.hovering)) {
						var atoms = [];
						var bonds = [];
						var q = new structures.Queue();
						q.enqueue(this.sketcher.molecule.bonds[j].getNeighbor(this.sketcher.hovering));
						while (!q.isEmpty()) {
							var a = q.dequeue();
							if (!a.visited) {
								a.visited = true;
								atoms.push(a);
								for ( var k = 0, kk = this.sketcher.molecule.bonds.length; k < kk; k++) {
									if (this.sketcher.molecule.bonds[k].contains(a) && !this.sketcher.molecule.bonds[k].getNeighbor(a).visited) {
										q.enqueue(this.sketcher.molecule.bonds[k].getNeighbor(a));
										bonds.push(this.sketcher.molecule.bonds[k]);
									}
								}
							}
						}
						connectionsA.push(atoms);
						connectionsB.push(bonds);
					}
				}
				var largest = -1;
				var index = -1;
				for ( var j = 0, jj = connectionsA.length; j < jj; j++) {
					if (connectionsA[j].length > largest) {
						index = j;
						largest = connectionsA[j].length;
					}
				}
				if (index > -1) {
					var as = [];
					var bs = [];
					for ( var i = 0, ii = this.sketcher.molecule.atoms.length; i < ii; i++) {
						if (inArray(this.sketcher.molecule.atoms[i], connectionsA[index]) == -1) {
							as.push(this.sketcher.molecule.atoms[i]);
						}
					}
					for ( var i = 0, ii = this.sketcher.molecule.bonds.length; i < ii; i++) {
						if (inArray(this.sketcher.molecule.bonds[i], connectionsB[index]) == -1) {
							bs.push(this.sketcher.molecule.bonds[i]);
						}
					}
					this.sketcher.historyManager.pushUndo(new actions.DeleteAction(this.sketcher.molecule, as, bs));
				} else {
					this.sketcher.historyManager.pushUndo(new actions.ClearAction(this.sketcher));
				}
			} else if (this.sketcher.hovering instanceof structures.Bond) {
				if (this.sketcher.hovering.ring != null) {
					var bs = [];
					bs[0] = this.sketcher.hovering;
					this.sketcher.historyManager.pushUndo(new actions.DeleteAction(this.sketcher.molecule, null, bs));
				}
			}
			this.sketcher.repaint();
		}
	};
	states.EraseState.prototype.innermouseup = function(e) {
		this.handleDelete();
	};
	states.EraseState.prototype.innermousemove = function(e) {
		this.findHoveredObject(e, true, true);
	};

})(ChemDoodle.sketcher.actions, ChemDoodle.sketcher.states, ChemDoodle.structures, jQuery.inArray);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(actions, states) {

	states.LabelState = function(sketcher) {
		this.setup(sketcher);
		this.label = 'C';
		return true;
	};
	states.LabelState.prototype = new states._State();
	states.LabelState.prototype.innermouseup = function(e) {
		if (this.sketcher.hovering != null) {
			this.sketcher.historyManager.pushUndo(new actions.ChangeLabelAction(this.sketcher.hovering, this.label));
		}
	};
	states.LabelState.prototype.innermousemove = function(e) {
		this.findHoveredObject(e, true, false);
	};

})(ChemDoodle.sketcher.actions, ChemDoodle.sketcher.states);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(actions, states) {

	states.LonePairState = function(sketcher) {
		this.setup(sketcher);
		this.delta = 1;
		return true;
	};
	states.LonePairState.prototype = new states._State();
	states.LonePairState.prototype.innermouseup = function(e) {
		if(this.delta<0&&this.sketcher.hovering.numLonePair<1){
			return;
		}
		if (this.sketcher.hovering != null) {
			this.sketcher.historyManager.pushUndo(new actions.ChangeLonePairAction(this.sketcher.hovering, this.delta));
		}
	};
	states.LonePairState.prototype.innermousemove = function(e) {
		this.findHoveredObject(e, true, false);
	};

})(ChemDoodle.sketcher.actions, ChemDoodle.sketcher.states);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(actions, states, structures) {

	states.MoveState = function(sketcher) {
		this.setup(sketcher);
		this.action = null;
		return true;
	};
	states.MoveState.prototype = new states._State();
	states.MoveState.prototype.innerdrag = function(e) {
		if (this.sketcher.hovering != null) {
			if (this.action == null) {
				var as = [];
				var dif = new structures.Point(e.p.x, e.p.y);
				if (this.sketcher.hovering instanceof structures.Atom) {
					dif.sub(this.sketcher.hovering);
					as[0] = this.sketcher.hovering;
				} else if (this.sketcher.hovering instanceof structures.Bond) {
					dif.sub(this.sketcher.lastPoint);
					as[0] = this.sketcher.hovering.a1;
					as[1] = this.sketcher.hovering.a2;
				}
				this.action = new actions.MoveAction(as, dif);
				this.sketcher.historyManager.pushUndo(this.action);
			} else {
				var dif = new structures.Point(e.p.x, e.p.y);
				dif.sub(this.sketcher.lastPoint);
				this.action.dif.add(dif);
				for ( var i = 0, ii = this.action.as.length; i < ii; i++) {
					this.action.as[i].add(dif);
				}
				this.sketcher.molecule.check();
				this.sketcher.repaint();
			}
		}
	};
	states.MoveState.prototype.innermousemove = function(e) {
		this.findHoveredObject(e, true, true);
	};
	states.MoveState.prototype.innermouseup = function(e) {
		this.action = null;
	};

})(ChemDoodle.sketcher.actions, ChemDoodle.sketcher.states, ChemDoodle.structures);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3103 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-20 12:58:08 -0500 (Sun, 20 Feb 2011) $
//
(function(monitor, actions, states, structures, m) {

	states.NewBondState = function(sketcher) {
		this.setup(sketcher);
		this.bondOrder = 1;
		this.stereo = structures.Bond.STEREO_NONE;
		return true;
	};
	states.NewBondState.prototype = new states._State();
	states.NewBondState.prototype.incrementBondOrder = function(b) {
		if (this.bondOrder == 1 && this.stereo == structures.Bond.STEREO_NONE) {
			this.sketcher.historyManager.pushUndo(new actions.ChangeBondAction(b));
		} else {
			if(b.bondOrder==this.bondOrder&&b.stereo==this.stereo){
				if(b.bondOrder==1&&b.stereo!=structures.Bond.STEREO_NONE || b.bondOrder==2 && b.stereo==structures.Bond.STEREO_NONE){
					this.sketcher.historyManager.pushUndo(new actions.FlipBondAction(b));
				}
			}else{
				this.sketcher.historyManager.pushUndo(new actions.ChangeBondAction(b, this.bondOrder, this.stereo));
			}
		}
	};

	states.NewBondState.prototype.innerdrag = function(e) {
		if (this.sketcher.hovering instanceof structures.Atom) {
			if (e.p.distance(this.sketcher.hovering) < 15) {
				var angle = this.getOptimumAngle(this.sketcher.hovering);
				var x = this.sketcher.hovering.x + this.sketcher.specs.bondLength * m.cos(angle);
				var y = this.sketcher.hovering.y - this.sketcher.specs.bondLength * m.sin(angle);
				this.sketcher.tempAtom = new structures.Atom('C', x, y, 0);
			} else {
				if (monitor.ALT && monitor.SHIFT) {
					this.sketcher.tempAtom = new structures.Atom('C', e.p.x, e.p.y, 0);
				} else {
					var angle = this.sketcher.hovering.angle(e.p);
					var length = this.sketcher.hovering.distance(e.p);
					if (!monitor.SHIFT) {
						length = this.sketcher.specs.bondLength;
					}
					if (!monitor.ALT) {
						var increments = m.floor((angle + m.PI / 12) / (m.PI / 6));
						angle = increments * m.PI / 6;
					}
					this.sketcher.tempAtom = new structures.Atom('C', this.sketcher.hovering.x + length * m.cos(angle), this.sketcher.hovering.y - length * m.sin(angle), 0);
				}
			}
			for ( var j = 0, jj = this.sketcher.molecule.atoms.length; j < jj; j++) {
				if (this.sketcher.molecule.atoms[j].distance(this.sketcher.tempAtom) < 5) {
					this.sketcher.tempAtom.x = this.sketcher.molecule.atoms[j].x;
					this.sketcher.tempAtom.y = this.sketcher.molecule.atoms[j].y;
					this.sketcher.tempAtom.isOverlap = true;
				}
			}
			this.sketcher.repaint();
		}
	};
	states.NewBondState.prototype.innermousedown = function(e) {
		if (this.sketcher.hovering instanceof structures.Atom) {
			this.sketcher.hovering.isHover = false;
			this.sketcher.hovering.isSelected = true;
			this.drag(e);
		} else if (this.sketcher.hovering instanceof structures.Bond) {
			this.sketcher.hovering.isHover = false;
			this.incrementBondOrder(this.sketcher.hovering);
			this.sketcher.molecule.check();
			this.sketcher.repaint();
		}
	};
	states.NewBondState.prototype.innermouseup = function(e) {
		if (this.sketcher.tempAtom != null && this.sketcher.hovering != null) {
			var as = [];
			var bs = [];
			var makeBond = true;
			if (this.sketcher.tempAtom.isOverlap) {
				for ( var j = 0, jj = this.sketcher.molecule.atoms.length; j < jj; j++) {
					if (this.sketcher.molecule.atoms[j].distance(this.sketcher.tempAtom) < 5) {
						this.sketcher.tempAtom = this.sketcher.molecule.atoms[j];
					}
				}
				var bond = this.getBond(this.sketcher.hovering, this.sketcher.tempAtom);
				if (bond != null) {
					this.incrementBondOrder(bond);
					makeBond = false;
				}
			} else {
				as.push(this.sketcher.tempAtom);
			}
			if (makeBond) {
				bs[0] = new structures.Bond(this.sketcher.hovering, this.sketcher.tempAtom, this.bondOrder);
				bs[0].stereo = this.stereo;
				this.sketcher.historyManager.pushUndo(new actions.AddAction(this.sketcher.molecule, as, bs));
			}
		}
		this.sketcher.tempAtom = null;
		if (!this.sketcher.isMobile) {
			this.mousemove(e);
		}
	};
	states.NewBondState.prototype.innermousemove = function(e) {
		if (this.sketcher.tempAtom != null) {
			return;
		}
		this.findHoveredObject(e, true, true);
	};

})(ChemDoodle.monitor, ChemDoodle.sketcher.actions, ChemDoodle.sketcher.states, ChemDoodle.structures, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3469 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-21 10:01:03 -0500 (Sat, 21 Jan 2012) $
//
(function(math, monitor, actions, states, structures, inArray, m) {

	states.NewRingState = function(sketcher) {
		this.setup(sketcher);
		this.numSides = 6;
		this.unsaturated = false;
		return true;
	};
	states.NewRingState.prototype = new states._State();
	states.NewRingState.prototype.getRing = function(a, numSides, bondLength, angle, setOverlaps) {
		var innerAngle = m.PI - 2 * m.PI / numSides;
		angle += innerAngle / 2;
		var ring = [];
		for ( var i = 0; i < numSides - 1; i++) {
			var p = i == 0 ? new structures.Atom('C', a.x, a.y) : new structures.Atom('C', ring[ring.length - 1].x, ring[ring.length - 1].y);
			p.x += bondLength * m.cos(angle);
			p.y -= bondLength * m.sin(angle);
			ring.push(p);
			angle += m.PI + innerAngle;
		}
		for ( var j = 0, jj = this.sketcher.molecule.atoms.length; j < jj; j++) {
			this.sketcher.molecule.atoms[j].isOverlap = false;
		}
		for ( var i = 0, ii = ring.length; i < ii; i++) {
			var minDist = Infinity;
			var closest = null;
			for ( var j = 0, jj = this.sketcher.molecule.atoms.length; j < jj; j++) {
				var dist = this.sketcher.molecule.atoms[j].distance(ring[i]);
				if (dist < minDist) {
					minDist = dist;
					closest = this.sketcher.molecule.atoms[j];
				}
			}
			if (minDist < 5) {
				ring[i] = closest;
				if (setOverlaps) {
					closest.isOverlap = true;
				}
			}
		}
		return ring;
	};
	states.NewRingState.prototype.getOptimalRing = function(b, numSides) {
		var innerAngle = m.PI / 2 - m.PI / numSides;
		var bondLength = b.a1.distance(b.a2);
		var ring1 = this.getRing(b.a1, numSides, bondLength, b.a1.angle(b.a2) - innerAngle, false);
		var ring2 = this.getRing(b.a2, numSides, bondLength, b.a2.angle(b.a1) - innerAngle, false);
		var dist1 = 0, dist2 = 0;
		for ( var i = 1, ii = ring1.length; i < ii; i++) {
			for ( var j = 0, jj = this.sketcher.molecule.atoms.length; j < jj; j++) {
				var d1 = this.sketcher.molecule.atoms[j].distance(ring1[i]);
				var d2 = this.sketcher.molecule.atoms[j].distance(ring2[i]);
				dist1 += m.min(1E8, 1 / (d1*d1));
				dist2 += m.min(1E8, 1 / (d2*d2));
			}
		}
		if (dist1 < dist2) {
			return ring1;
		} else {
			return ring2;
		}
	};

	states.NewRingState.prototype.innerdrag = function(e) {
		if (this.sketcher.hovering instanceof structures.Atom) {
			var a = 0;
			var l = 0;
			if (e.p.distance(this.sketcher.hovering) < 15) {
				var angles = this.sketcher.molecule.getAngles(this.sketcher.hovering);
				if (angles.length == 0) {
					a = 3 * m.PI / 2;
				} else {
					a = math.angleBetweenLargest(angles).angle;
				}
				l = this.sketcher.specs.bondLength;
			} else {
				a = this.sketcher.hovering.angle(e.p);
				l = this.sketcher.hovering.distance(e.p);
				if (!(monitor.ALT && monitor.SHIFT)) {
					if (!monitor.SHIFT) {
						l = this.sketcher.specs.bondLength;
					}
					if (!monitor.ALT) {
						var increments = m.floor((a + m.PI / 12) / (m.PI / 6));
						a = increments * m.PI / 6;
					}
				}
			}
			this.sketcher.tempRing = this.getRing(this.sketcher.hovering, this.numSides, l, a, true);
			this.sketcher.repaint();
		} else if (this.sketcher.hovering instanceof structures.Bond) {
			var dist = math.distanceFromPointToLineInclusive(e.p, this.sketcher.hovering.a1, this.sketcher.hovering.a2);
			var ringUse = null;
			if (dist != -1 && dist <= 7) {
				ringUse = this.getOptimalRing(this.sketcher.hovering, this.numSides);
			} else {
				var innerAngle = m.PI / 2 - m.PI / this.numSides;
				var bondLength = this.sketcher.hovering.a1.distance(this.sketcher.hovering.a2);
				var ring1 = this.getRing(this.sketcher.hovering.a1, this.numSides, bondLength, this.sketcher.hovering.a1.angle(this.sketcher.hovering.a2) - innerAngle, false);
				var ring2 = this.getRing(this.sketcher.hovering.a2, this.numSides, bondLength, this.sketcher.hovering.a2.angle(this.sketcher.hovering.a1) - innerAngle, false);
				var center1 = new structures.Point();
				var center2 = new structures.Point();
				for ( var i = 1, ii = ring1.length; i < ii; i++) {
					center1.add(ring1[i]);
					center2.add(ring2[i]);
				}
				center1.x /= (ring1.length - 1);
				center1.y /= (ring1.length - 1);
				center2.x /= (ring2.length - 1);
				center2.y /= (ring2.length - 1);
				var dist1 = center1.distance(e.p);
				var dist2 = center2.distance(e.p);
				ringUse = ring2;
				if (dist1 < dist2) {
					ringUse = ring1;
				}
			}
			for ( var j = 1, jj = ringUse.length; j < jj; j++) {
				if (inArray(ringUse[j], this.sketcher.molecule.atoms) != -1) {
					ringUse[j].isOverlap = true;
				}
			}
			this.sketcher.tempRing = ringUse;
			this.sketcher.repaint();
		}
	};
	states.NewRingState.prototype.innermousedown = function(e) {
		if (this.sketcher.hovering != null) {
			this.sketcher.hovering.isHover = false;
			this.sketcher.hovering.isSelected = true;
			this.drag(e);
		}
	};
	states.NewRingState.prototype.innermouseup = function(e) {
		if (this.sketcher.tempRing != null && this.sketcher.hovering != null) {
			var as = [];
			var bs = [];
			if (this.sketcher.hovering instanceof structures.Atom) {
				if (inArray(this.sketcher.tempRing[0], this.sketcher.molecule.atoms) == -1) {
					as.push(this.sketcher.tempRing[0]);
				}
				if (!this.bondExists(this.sketcher.hovering, this.sketcher.tempRing[0])) {
					bs.push(new structures.Bond(this.sketcher.hovering, this.sketcher.tempRing[0]));
				}
				for ( var i = 1, ii = this.sketcher.tempRing.length; i < ii; i++) {
					if (inArray(this.sketcher.tempRing[i], this.sketcher.molecule.atoms) == -1) {
						as.push(this.sketcher.tempRing[i]);
					}
					if (!this.bondExists(this.sketcher.tempRing[i - 1], this.sketcher.tempRing[i])) {
						bs.push(new structures.Bond(this.sketcher.tempRing[i - 1], this.sketcher.tempRing[i], i % 2 == 1 && this.unsaturated ? 2 : 1));
					}
				}
				if (!this.bondExists(this.sketcher.tempRing[this.sketcher.tempRing.length - 1], this.sketcher.hovering)) {
					bs.push(new structures.Bond(this.sketcher.tempRing[this.sketcher.tempRing.length - 1], this.sketcher.hovering, this.unsaturated ? 2 : 1));
				}
			} else if (this.sketcher.hovering instanceof structures.Bond) {
				var start = this.sketcher.hovering.a2;
				var end = this.sketcher.hovering.a1;
				if (this.sketcher.tempRing[0] == this.sketcher.hovering.a1) {
					start = this.sketcher.hovering.a1;
					end = this.sketcher.hovering.a2;
				}
				if (inArray(this.sketcher.tempRing[1], this.sketcher.molecule.atoms) == -1) {
					as.push(this.sketcher.tempRing[1]);
				}
				if (!this.bondExists(start, this.sketcher.tempRing[1])) {
					bs.push(new structures.Bond(start, this.sketcher.tempRing[1]));
				}
				for ( var i = 2, ii = this.sketcher.tempRing.length; i < ii; i++) {
					if (inArray(this.sketcher.tempRing[i], this.sketcher.molecule.atoms) == -1) {
						as.push(this.sketcher.tempRing[i]);
					}
					if (!this.bondExists(this.sketcher.tempRing[i - 1], this.sketcher.tempRing[i])) {
						bs.push(new structures.Bond(this.sketcher.tempRing[i - 1], this.sketcher.tempRing[i], i % 2 == 0 && this.unsaturated ? 2 : 1));
					}
				}
				if (!this.bondExists(this.sketcher.tempRing[this.sketcher.tempRing.length - 1], end)) {
					bs.push(new structures.Bond(this.sketcher.tempRing[this.sketcher.tempRing.length - 1], end));
				}
			}
			if (as.length != 0 || bs.length != 0) {
				this.sketcher.historyManager.pushUndo(new actions.AddAction(this.sketcher.molecule, as, bs));
			}
		}
		for ( var j = 0, jj = this.sketcher.molecule.atoms.length; j < jj; j++) {
			this.sketcher.molecule.atoms[j].isOverlap = false;
		}
		this.sketcher.tempRing = null;
		if (!this.sketcher.isMobile) {
			this.mousemove(e);
		}
	};
	states.NewRingState.prototype.innermousemove = function(e) {
		if (this.sketcher.tempAtom != null) {
			return;
		}
		this.findHoveredObject(e, true, true);
	};

})(ChemDoodle.math, ChemDoodle.monitor, ChemDoodle.sketcher.actions, ChemDoodle.sketcher.states, ChemDoodle.structures, jQuery.inArray, Math);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3469 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-21 10:01:03 -0500 (Sat, 21 Jan 2012) $
//

(function(states) {

	states.StateManager = function(sketcher) {
		this.STATE_NEW_BOND = new states.NewBondState(sketcher);
		this.STATE_NEW_RING = new states.NewRingState(sketcher);
		this.STATE_CHARGE = new states.ChargeState(sketcher);
		this.STATE_LONE_PAIR = new states.LonePairState(sketcher);
		this.STATE_MOVE = new states.MoveState(sketcher);
		this.STATE_ERASE = new states.EraseState(sketcher);
		this.STATE_LABEL = new states.LabelState(sketcher);
		this.currentState = this.STATE_NEW_BOND;
		return true;
	};

})(ChemDoodle.sketcher.states);

//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(desktop, q) {

	desktop.Button = function(id, iconPath, icon, tooltip, func) {
		this.id = id;
		this.iconPath = iconPath;
		this.icon = icon;
		this.toggle = false;
		this.tooltip = tooltip ? tooltip : '';
		this.func = func ? func : null;
		return true;
	};
	desktop.Button.prototype.getElement = function() {
		return q('#' + this.id);
	};
	desktop.Button.prototype.getSource = function(buttonGroup) {
		var sb = [];
		if (this.toggle) {
			sb.push('<input type="radio" name="');
			sb.push(buttonGroup);
			sb.push('" id="');
			sb.push(this.id);
			sb.push('"><label for="');
			sb.push(this.id);
			sb.push('"><img id="');
			sb.push(this.id);
			sb.push('_icon" title="');
			sb.push(this.tooltip);
			sb.push('" src="');
			sb.push(this.iconPath);
			sb.push(this.icon);
			sb.push('.png"></label>');
		} else {
			sb.push('<button id="');
			sb.push(this.id);
			sb.push('" onclick="return false;"><img title="');
			sb.push(this.tooltip);
			sb.push('" width="20" height="20" src="');
			sb.push(this.iconPath);
			sb.push(this.icon);
			sb.push('.png"></button>');
		}
		return sb.join('');
	};
	desktop.Button.prototype.setup = function(lone) {
		if (!this.toggle || lone) {
			this.getElement().button();
		}
		this.getElement().click(this.func);
	};
	desktop.Button.prototype.disable = function() {
		var element = this.getElement();
		element.mouseout();
		element.button('disable');
	};
	desktop.Button.prototype.enable = function() {
		this.getElement().button('enable');
	};
	desktop.Button.prototype.select = function() {
		var element = this.getElement();
		element.attr('checked', true);
		element.button('refresh');
	};

})(ChemDoodle.sketcher.gui.desktop, jQuery);

//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//
(function(desktop, q) {

	desktop.ButtonSet = function(id) {
		this.id = id;
		this.buttons = [];
		this.buttonGroup = 'main_group';
		this.toggle = true;
		return true;
	};
	desktop.ButtonSet.prototype.getElement = function() {
		return q('#' + this.id);
	};
	desktop.ButtonSet.prototype.getSource = function() {
		var sb = [];
		sb.push('<span id="');
		sb.push(this.id);
		sb.push('">');
		for ( var i = 0, ii = this.buttons.length; i < ii; i++) {
			if (this.toggle) {
				this.buttons[i].toggle = true;
			}
			sb.push(this.buttons[i].getSource(this.buttonGroup));
		}
		if (this.dropDown != null) {
			sb.push(this.dropDown.getButtonSource());
		}
		sb.push('</span>');
		if (this.dropDown != null) {
			sb.push(this.dropDown.getHiddenSource());
		}
		return sb.join('');
	};
	desktop.ButtonSet.prototype.setup = function() {
		this.getElement().buttonset();
		for ( var i = 0, ii = this.buttons.length; i < ii; i++) {
			this.buttons[i].setup(false);
		}
		if (this.dropDown != null) {
			this.dropDown.setup();
		}
	};
	desktop.ButtonSet.prototype.addDropDown = function(tooltip, iconPath) {
		this.dropDown = new desktop.DropDown(this.id + '_dd', iconPath, tooltip, this.buttons[this.buttons.length - 1]);
	};

})(ChemDoodle.sketcher.gui.desktop, jQuery);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3078 $
//  $Author: kevin $
//  $LastChangedDate: 2011-02-06 18:27:15 -0500 (Sun, 06 Feb 2011) $
//

(function(desktop, q, document) {

	desktop.Dialog = function(id, title) {
		this.id = id;
		this.title = title ? title : 'Information';
		this.buttons = null;
		this.message = null;
		this.afterMessage = null;
		this.includeTextArea = false;
		return true;
	};
	desktop.Dialog.prototype.getElement = function() {
		return q('#' + this.id);
	};
	desktop.Dialog.prototype.getTextArea = function() {
		return q('#' + this.id + '_ta');
	};
	desktop.Dialog.prototype.setup = function() {
		var sb = [];
		sb.push('<div style="font-size:12px;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		if (this.message != null) {
			sb.push('<p>');
			sb.push(this.message);
			sb.push('</p>');
		}
		if (this.includeTextArea) {
			sb.push('<textarea style="font-family:\'Courier New\';" id="');
			sb.push(this.id);
			sb.push('_ta" cols="55" rows="10"></textarea>');
		}
		if (this.afterMessage != null) {
			sb.push('<p>');
			sb.push(this.afterMessage);
			sb.push('</p>');
		}
		sb.push('</div>');
		document.writeln(sb.join(''));
		var self = this;
		this.getElement().dialog({
			autoOpen : false,
			width : 435,
			buttons : self.buttons
		});
	};

})(ChemDoodle.sketcher.gui.desktop, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2977 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-29 19:11:54 -0500 (Wed, 29 Dec 2010) $
//

(function(c, desktop, q, document) {

	desktop.MolGrabberDialog = function(id) {
		this.id = id;
		this.title = 'MolGrabber';
		this.buttons = null;
		this.message = null;
		this.afterMessage = null;
		this.includeTextArea = false;
		return true;
	};
	desktop.MolGrabberDialog.prototype = new desktop.Dialog();
	desktop.MolGrabberDialog.prototype.setup = function() {
		var sb = [];
		sb.push('<div style="font-size:12px;text-align:center;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		if (this.message != null) {
			sb.push('<p>');
			sb.push(this.message);
			sb.push('</p>');
		}
		document.writeln(sb.join(''));
		this.canvas = new ChemDoodle.MolGrabberCanvas(this.id+'_mg', 200, 200);
		sb = [];
		if (this.afterMessage != null) {
			sb.push('<p>');
			sb.push(this.afterMessage);
			sb.push('</p>');
		}
		sb.push('</div>');
		document.writeln(sb.join(''));
		var self = this;
		this.getElement().dialog({
			autoOpen : false,
			width : 250,
			buttons : self.buttons
		});
	};

})(ChemDoodle, ChemDoodle.sketcher.gui.desktop, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2977 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-29 19:11:54 -0500 (Wed, 29 Dec 2010) $
//

(function(c, desktop, q, document) {

	desktop.PeriodicTableDialog = function(id) {
		this.id = id;
		this.title = 'Periodic Table';
		this.buttons = null;
		this.message = null;
		this.afterMessage = null;
		this.includeTextArea = false;
		return true;
	};
	desktop.PeriodicTableDialog.prototype = new desktop.Dialog();
	desktop.PeriodicTableDialog.prototype.setup = function() {
		var sb = [];
		sb.push('<div style="text-align:center;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		document.writeln(sb.join(''));
		this.canvas = new ChemDoodle.PeriodicTableCanvas(this.id+'_pt', 20);
		document.writeln('</div>');
		var self = this;
		this.getElement().dialog({
			autoOpen : false,
			width : 400,
			buttons : self.buttons
		});
	};

})(ChemDoodle, ChemDoodle.sketcher.gui.desktop, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 2977 $
//  $Author: kevin $
//  $LastChangedDate: 2010-12-29 19:11:54 -0500 (Wed, 29 Dec 2010) $
//

(function(c, desktop, q, document) {

	desktop.SaveFileDialog = function(id, sketcher) {
		this.id = id;
		this.sketcher = sketcher;
		this.title = 'Save File';
		this.buttons = null;
		this.afterMessage = null;
		this.includeTextArea = false;
		return true;
	};
	desktop.SaveFileDialog.prototype = new desktop.Dialog();
	desktop.SaveFileDialog.prototype.clear = function() {
		q('#' + this.id + '_link').html('The file link will appear here.');
	};
	desktop.SaveFileDialog.prototype.setup = function() {
		var sb = [];
		sb.push('<div style="font-size:12px;" id="');
		sb.push(this.id);
		sb.push('" title="');
		sb.push(this.title);
		sb.push('">');
		sb.push('<p>Select the file format to save your structure to and click on the <strong>Generate File</strong> button.</p>');
		sb.push('<select id="');
		sb.push(this.id);
		sb.push('_select">');
		sb.push('<option value="sk2">ACD/ChemSketch Document {sk2}');
		sb.push('<option value="ros">Beilstein ROSDAL {ros}');
		sb.push('<option value="cdx">Cambridgesoft ChemDraw Exchange {cdx}');
		sb.push('<option value="cdxml">Cambridgesoft ChemDraw XML {cdxml}');
		sb.push('<option value="mrv">ChemAxon Marvin Document {mrv}');
		sb.push('<option value="cml">Chemical Markup Language {cml}');
		sb.push('<option value="smiles">Daylight SMILES {smiles}');
		sb.push('<option value="icl" selected>iChemLabs ChemDoodle Document {icl}');
		sb.push('<option value="inchi">IUPAC InChI {inchi}');
		sb.push('<option value="jdx">IUPAC JCAMP-DX {jdx}');
		sb.push('<option value="skc">MDL ISIS Sketch {skc}');
		sb.push('<option value="tgf">MDL ISIS Sketch Transportable Graphics File {tgf}');
		sb.push('<option value="mol">MDL MOLFile {mol}');
		//sb.push('<option value="rdf">MDL RDFile {rdf}');
		//sb.push('<option value="rxn">MDL RXNFile {rxn}');
		sb.push('<option value="sdf">MDL SDFile {sdf}');
		sb.push('<option value="jme">Molinspiration JME String {jme}');
		sb.push('<option value="pdb">RCSB Protein Data Bank {pdb}');
		sb.push('<option value="mmd">Schr&ouml;dinger Macromodel {mmd}');
		sb.push('<option value="mae">Schr&ouml;dinger Maestro {mae}');
		sb.push('<option value="smd">Standard Molecular Data {smd}');
		sb.push('<option value="mol2">Tripos Mol2 {mol2}');
		sb.push('<option value="sln">Tripos SYBYL SLN {sln}');
		sb.push('<option value="xyz">XYZ {xyz}');
		sb.push('</select>');
		sb.push('<button id="');
		sb.push(this.id);
		sb.push('_button">');
		sb.push('Generate File</button>');
		sb.push('<p>When the file is written, a link will appear in the red-bordered box below, right-click on the link and choose the browser\'s <strong>Save As...</strong> function to save the file to your computer.</p>');
		sb.push('<div style="width:100%;height:30px;border:1px solid #c10000;text-align:center;" id="');
		sb.push(this.id);
		sb.push('_link">The file link will appear here.</div>');
		sb.push('<p><a href="http://www.chemdoodle.com" target="_blank">How do I use these files?</a></p>');
		sb.push('</div>');
		document.writeln(sb.join(''));
		var self = this;
		q('#' + this.id + '_button').click(function() {
			q('#' + self.id + '_link').html('Generating file, please wait...');
			ChemDoodle.iChemLabs.saveFile(self.sketcher.molecule, q('#' + self.id + '_select').val(), function(link){
				q('#' + self.id + '_link').html('<a href="'+link+'"><span style="text-decoration:underline;">File is generated. Right-click on this link and Save As...</span></a>');
			});
		});
		this.getElement().dialog({
			autoOpen : false,
			width : 435,
			buttons : self.buttons
		});
	};

})(ChemDoodle, ChemDoodle.sketcher.gui.desktop, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3458 $
//  $Author: kevin $
//  $LastChangedDate: 2011-12-23 10:57:22 -0500 (Fri, 23 Dec 2011) $
//

(function(c, actions, gui, desktop, q) {

	gui.DialogManager = function(sketcher) {
		if (sketcher.useServices) {
			this.saveDialog = new desktop.SaveFileDialog(sketcher.id+'_save_dialog', sketcher);
		} else {
			this.saveDialog = new desktop.Dialog(sketcher.id+'_save_dialog', 'Save Molecule');
			this.saveDialog.message = 'Copy and paste the content of the textarea into a file and save it with the extension <strong>.mol</strong>.';
			this.saveDialog.includeTextArea = true;
			// You must keep this link displayed at all times to abide by the
			// license
			// Contact us for permission to remove it,
			// http://www.ichemlabs.com/contact-us
			this.saveDialog.afterMessage = '<a href="http://www.chemdoodle.com" target="_blank">How do I use MOLFiles?</a>';
		}
		this.saveDialog.setup();

		this.loadDialog = new desktop.Dialog(sketcher.id+'_load_dialog', 'Load Molecule');
		this.loadDialog.message = 'Copy and paste the contents of a MOLFile (extension <strong>.mol</strong>) in the textarea below and then press the <strong>Load</strong> button.';
		this.loadDialog.includeTextArea = true;
		// You must keep this link displayed at all times to abide by the
		// license
		// Contact us for permission to remove it,
		// http://www.ichemlabs.com/contact-us
		this.loadDialog.afterMessage = '<a href="http://www.chemdoodle.com" target="_blank">Where do I get MOLFiles?</a>';
		var self = this;
		this.loadDialog.buttons = {
			'Load' : function() {
				q(this).dialog('close');
				var newMol = c.readMOL(self.loadDialog.getTextArea().val());
				if (newMol.atoms.length != 0) {
					sketcher.historyManager.pushUndo(new actions.SwitchMoleculeAction(sketcher, newMol));
				} else {
					alert('No chemical content was recognized.');
				}
			}
		};
		this.loadDialog.setup();

		this.searchDialog = new desktop.MolGrabberDialog(sketcher.id+'_search_dialog');
		this.searchDialog.buttons = {
			'Load' : function() {
				q(this).dialog('close');
				var newMol = self.searchDialog.canvas.molecule;
				if (newMol != null && newMol.atoms.length != 0 && newMol != sketcher.molecule) {
					sketcher.historyManager.pushUndo(new actions.SwitchMoleculeAction(sketcher, newMol));
				}
			}
		};
		this.searchDialog.setup();

		this.periodicTableDialog = new desktop.PeriodicTableDialog(sketcher.id+'_periodicTable_dialog');
		this.periodicTableDialog.buttons = {
			'Close' : function() {
				q(this).dialog('close');
			}
		};
		this.periodicTableDialog.setup();
		this.periodicTableDialog.canvas.click = function(evt) {
			if (this.hovered != null) {
				this.selected = this.hovered;
				var e = this.getHoveredElement();
				sketcher.stateManager.currentState = sketcher.stateManager.STATE_LABEL;
				sketcher.stateManager.STATE_LABEL.label = e.symbol;
				this.repaint();
			}
		};

		this.calculateDialog = new desktop.Dialog(sketcher.id+'_calculate_dialog', 'Calculations');
		this.calculateDialog.includeTextArea = true;
		// You must keep this link displayed at all times to abide by the
		// license
		// Contact us for permission to remove it,
		// http://www.ichemlabs.com/contact-us
		this.calculateDialog.afterMessage = '<a href="http://www.chemdoodle.com" target="_blank">Want more calculations?</a>';
		this.calculateDialog.setup();
		return true;
	};

})(ChemDoodle, ChemDoodle.sketcher.actions, ChemDoodle.sketcher.gui, ChemDoodle.sketcher.gui.desktop, jQuery);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3469 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-21 10:01:03 -0500 (Sat, 21 Jan 2012) $
//
(function(desktop, q, document) {

	desktop.DropDown = function(id, iconPath, tooltip, dummy) {
		this.id = id;
		this.iconPath = iconPath;
		this.tooltip = tooltip;
		this.dummy = dummy;
		this.buttonSet = new desktop.ButtonSet(id + '_set');
		this.buttonSet.buttonGroup = tooltip;
		this.defaultButton = null;
		return true;
	};
	desktop.DropDown.prototype.getButtonSource = function() {
		var sb = [];
		sb.push('<button id="');
		sb.push(this.id);
		sb.push('" onclick="return false;"><img title="');
		sb.push(this.tooltip);
		sb.push('" src="');
		sb.push(this.iconPath);
		sb.push('arrowDown.png"></button>');
		return sb.join('');
	};
	desktop.DropDown.prototype.getHiddenSource = function() {
		var sb = [];
		sb.push('<div style="display:none;position:absolute;z-index:10;border:1px #C1C1C1 solid;background:#F5F5F5;padding:5px;border-bottom-left-radius:5px;-moz-border-radius-bottomleft:5px;border-bottom-right-radius:5px;-moz-border-radius-bottomright:5px;" id="');
		sb.push(this.id);
		sb.push('_hidden">');
		sb.push(this.buttonSet.getSource());
		sb.push('</div>');
		return sb.join('');
	};
	desktop.DropDown.prototype.setup = function() {
		if(this.defaultButton==null){
			this.defaultButton = this.buttonSet.buttons[0];
		}
		var tag = '#' + this.id;
		q(tag).button();
		q(tag + '_hidden').hide();
		q(tag).click(function() {
			var component = q(tag + '_hidden');
			component.show().position({
				my : 'center top',
				at : 'center bottom',
				of : this,
				collision: 'fit'
			});
			q(document).one('click', function() {
				component.hide();
			});
			return false;
		});
		this.buttonSet.setup();
		var self = this;
		q.each(this.buttonSet.buttons, function(index, value) {
			self.buttonSet.buttons[index].getElement().click(function() {
				self.dummy.absorb(self.buttonSet.buttons[index]);
				self.dummy.select();
				self.dummy.func();
			});
		});
		self.dummy.absorb(this.defaultButton);
		this.defaultButton.select();
	};

})(ChemDoodle.sketcher.gui.desktop, jQuery, document);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3437 $
//  $Author: kevin $
//  $LastChangedDate: 2011-11-13 12:56:18 -0500 (Sun, 13 Nov 2011) $
//

(function(desktop, q) {

	desktop.DummyButton = function(id, iconPath, icon, tooltip) {
		this.id = id;
		this.iconPath = iconPath;
		this.icon = icon;
		this.toggle = false;
		this.tooltip = tooltip ? tooltip : '';
		this.func = null;
		return true;
	};
	desktop.DummyButton.prototype = new desktop.Button();
	desktop.DummyButton.prototype.setup = function() {
		var self = this;
		this.getElement().click(function() {
			self.func();
		});
	};
	desktop.DummyButton.prototype.absorb = function(button) {
		q('#' + this.id + '_icon').attr('src', button.iconPath + button.icon + '.png');
		q('#' + this.id).button('refresh');
		this.func = button.func;
	};

})(ChemDoodle.sketcher.gui.desktop, jQuery);
//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3469 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-21 10:01:03 -0500 (Sat, 21 Jan 2012) $
//
(function(c, iChemLabs, io, actions, gui, desktop, structures, q, document) {

	gui.ToolbarManager = function(sketcher) {
		this.sketcher = sketcher;

		// open
		this.buttonOpen = new desktop.Button(sketcher.id+'_button_open', sketcher.iconPath, 'open20', 'Open', function() {
			sketcher.dialogManager.loadDialog.getTextArea().val('');
			sketcher.dialogManager.loadDialog.getElement().dialog('open');
		});
		// save
		this.buttonSave = new desktop.Button(sketcher.id+'_button_save', sketcher.iconPath, 'save20', 'Save', function() {
			if(sketcher.useServices){
				sketcher.dialogManager.saveDialog.clear();
			}else{
				sketcher.dialogManager.saveDialog.getTextArea().val(c.writeMOL(sketcher.molecule));
			}
			sketcher.dialogManager.saveDialog.getElement().dialog('open');
		});
		// search
		this.buttonSearch = new desktop.Button(sketcher.id+'_button_search', sketcher.iconPath, 'search20', 'Search', function() {
			sketcher.dialogManager.searchDialog.getElement().dialog('open');
		});
		// calculate
		this.buttonCalculate = new desktop.Button(sketcher.id+'_button_calculate', sketcher.iconPath, 'calculate20', 'Calculate', function() {
			iChemLabs.calculate(sketcher.molecule, ['mf', 'mw', 'miw', 'deg_unsat', 'hba', 'hbd', 'pol_miller', 'cmr', 'tpsa', 'xlogp2'], function(content){
				var sb = [];
				function addDatum(title, value, unit){
					sb.push(title);
					sb.push(': ');
					for(var i = title.length+2; i<30; i++){
						sb.push(' ');
					}
					sb.push(value);
					sb.push(' ');
					sb.push(unit);
					sb.push('\n');
				}
				addDatum('Molecular Formula', content.mf, '');
				addDatum('Molecular Mass', content.mw, 'amu');
				addDatum('Monoisotopic Mass', content.miw, 'amu');
				addDatum('Degree of Unsaturation', content.deg_unsat, '');
				addDatum('Hydrogen Bond Acceptors', content.hba, '');
				addDatum('Hydrogen Bond Donors', content.hbd, '');
				addDatum('Molecular Polarizability', content.pol_miller, 'Å³');
				addDatum('Molar Refractivity', content.cmr, 'cm³/mol');
				addDatum('Polar Surface Area', content.tpsa, 'Å²');
				addDatum('logP', content.xlogp2, '');
				sketcher.dialogManager.calculateDialog.getTextArea().val(sb.join(''));
				sketcher.dialogManager.calculateDialog.getElement().dialog('open');
			});
		});

		// move
		this.buttonMove = new desktop.Button(sketcher.id+'_button_move', sketcher.iconPath, 'move20', 'Move', function() {
			sketcher.stateManager.currentState = sketcher.stateManager.STATE_MOVE;
		});
		this.buttonMove.toggle = true;
		// erase
		this.buttonErase = new desktop.Button(sketcher.id+'_button_erase', sketcher.iconPath, 'erase20', 'Erase', function() {
			sketcher.stateManager.currentState = sketcher.stateManager.STATE_ERASE;
		});
		this.buttonErase.toggle = true;

		// clear
		this.buttonClear = new desktop.Button(sketcher.id+'_button_clear', sketcher.iconPath, 'clear20', 'Clear', function() {
			var clear = true;
			if (sketcher.molecule.atoms.length == 1) {
				var a = sketcher.molecule.atoms[0];
				if (a.label == 'C' && a.charge == 0 && a.mass == -1) {
					clear = false;
				}
			}
			if (clear) {
				sketcher.historyManager.pushUndo(new actions.ClearAction(sketcher));
			}
		});
		// clean
		this.buttonClean = new desktop.Button(sketcher.id+'_button_clean', sketcher.iconPath, 'optimize20', 'Clean', function() {
			iChemLabs.contactServer('optimize', {'mol':io.toJSONDummy(sketcher.molecule), 'dimension':2}, function(content) {
				var optimized = io.fromJSONDummy(content.mol);
				var optCenter = optimized.getCenter();
				var dif = new structures.Point(sketcher.width/2, sketcher.height/2);
				dif.sub(optCenter);
				for ( var i = 0, ii = optimized.atoms.length; i < ii; i++) {
					optimized.atoms[i].add(dif);
				}
				sketcher.historyManager.pushUndo(new actions.ChangeCoordinatesAction(sketcher.molecule.atoms, optimized.atoms));
			});
		});

		// scale set
		this.makeScaleSet(this);

		// history set
		this.makeHistorySet(this);

		// label set
		this.makeLabelSet(this);

		// bond set
		this.makeBondSet(this);

		// ring set
		this.makeRingSet(this);

		// charge set
		this.makeAttributeSet(this);

		return true;
	};
	gui.ToolbarManager.prototype.write = function() {
		var sb = [];
		sb.push(this.buttonOpen.getSource());
		sb.push(this.buttonSave.getSource());
		if(this.sketcher.useServices){
			sb.push(this.buttonSearch.getSource());
		}
		sb.push(this.scaleSet.getSource());
		sb.push(this.buttonClear.getSource());
		sb.push(this.buttonErase.getSource('main_group'));
		sb.push(this.buttonMove.getSource('main_group'));
		if(this.sketcher.useServices){
			sb.push(this.buttonClean.getSource());
		}
		sb.push(this.historySet.getSource());
		if(this.sketcher.useServices){
			sb.push(this.buttonCalculate.getSource());
		}
		sb.push('<br>');
		sb.push(this.labelSet.getSource());
		sb.push(this.bondSet.getSource());
		sb.push(this.ringSet.getSource());
		sb.push(this.attributeSet.getSource());
		sb.push('<br>');
		document.write(sb.join(''));
	};
	gui.ToolbarManager.prototype.setup = function() {
		this.buttonOpen.setup();
		this.buttonSave.setup();
		if(this.sketcher.useServices){
			this.buttonSearch.setup();
		}
		this.scaleSet.setup();
		this.buttonClear.setup();
		this.buttonErase.setup(true);
		this.buttonMove.setup(true);
		if(this.sketcher.useServices){
			this.buttonClean.setup();
		}
		this.historySet.setup();
		if(this.sketcher.useServices){
			this.buttonCalculate.setup();
		}
		this.labelSet.setup();
		this.bondSet.setup();
		this.ringSet.setup();
		this.attributeSet.setup();

		this.buttonSingle.select();
		this.buttonUndo.disable();
		this.buttonRedo.disable();
	};

	gui.ToolbarManager.prototype.makeScaleSet = function(self) {
		this.scaleSet = new desktop.ButtonSet(self.sketcher.id+'_buttons_scale');
		this.scaleSet.toggle = false;
		this.buttonScalePlus = new desktop.Button(self.sketcher.id+'_button_scale_plus', self.sketcher.iconPath, 'zoomIn20', 'Increase Scale', function() {
			self.sketcher.specs.scale *= 1.5;
			self.sketcher.checkScale();
			self.sketcher.repaint();
		});
		this.scaleSet.buttons.push(this.buttonScalePlus);
		this.buttonScaleMinus = new desktop.Button(self.sketcher.id+'_button_scale_minus', self.sketcher.iconPath, 'zoomOut20', 'Decrease Scale', function() {
			self.sketcher.specs.scale /= 1.5;
			self.sketcher.checkScale();
			self.sketcher.repaint();
		});
		this.scaleSet.buttons.push(this.buttonScaleMinus);
	};
	gui.ToolbarManager.prototype.makeHistorySet = function(self) {
		this.historySet = new desktop.ButtonSet(self.sketcher.id+'_buttons_history');
		this.historySet.toggle = false;
		this.buttonUndo = new desktop.Button(self.sketcher.id+'_button_undo', self.sketcher.iconPath, 'undo20', 'Undo', function() {
			self.sketcher.historyManager.undo();
		});
		this.historySet.buttons.push(this.buttonUndo);
		this.buttonRedo = new desktop.Button(self.sketcher.id+'_button_redo', self.sketcher.iconPath, 'redo20', 'Redo', function() {
			self.sketcher.historyManager.redo();
		});
		this.historySet.buttons.push(this.buttonRedo);
	};
	gui.ToolbarManager.prototype.makeLabelSet = function(self) {
		this.labelSet = new desktop.ButtonSet(self.sketcher.id+'_buttons_label');
		this.buttonLabel = new desktop.DummyButton(self.sketcher.id+'_button_label', self.sketcher.iconPath, 'Carbon', 'Set Label');
		this.labelSet.buttons.push(this.buttonLabel);
		this.labelSet.addDropDown('More Labels', self.sketcher.iconPath);
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_h', self.sketcher.iconPath, 'Hydrogen', 'Hydrogen', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LABEL;
			self.sketcher.stateManager.STATE_LABEL.label = 'H';
		}));
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_c', self.sketcher.iconPath, 'Carbon', 'Carbon', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LABEL;
			self.sketcher.stateManager.STATE_LABEL.label = 'C';
		}));
		this.labelSet.dropDown.defaultButton = this.labelSet.dropDown.buttonSet.buttons[this.labelSet.dropDown.buttonSet.buttons.length - 1];
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_n', self.sketcher.iconPath, 'Nitrogen', 'Nitrogen', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LABEL;
			self.sketcher.stateManager.STATE_LABEL.label = 'N';
		}));
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_o', self.sketcher.iconPath, 'Oxygen', 'Oxygen', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LABEL;
			self.sketcher.stateManager.STATE_LABEL.label = 'O';
		}));
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_f', self.sketcher.iconPath, 'Fluorine', 'Fluorine', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LABEL;
			self.sketcher.stateManager.STATE_LABEL.label = 'F';
		}));
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_cl', self.sketcher.iconPath, 'Chlorine', 'Chlorine', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LABEL;
			self.sketcher.stateManager.STATE_LABEL.label = 'Cl';
		}));
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_br', self.sketcher.iconPath, 'Bromine', 'Bromine', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LABEL;
			self.sketcher.stateManager.STATE_LABEL.label = 'Br';
		}));
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_i', self.sketcher.iconPath, 'Iodine', 'Iodine', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LABEL;
			self.sketcher.stateManager.STATE_LABEL.label = 'I';
		}));
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_p', self.sketcher.iconPath, 'Phosphorus', 'Phosphorus', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LABEL;
			self.sketcher.stateManager.STATE_LABEL.label = 'P';
		}));
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_s', self.sketcher.iconPath, 'Sulfur', 'Sulfur', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LABEL;
			self.sketcher.stateManager.STATE_LABEL.label = 'S';
		}));
		this.labelSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_label_pt', self.sketcher.iconPath, 'periodicTable20', 'Choose Symbol', function() {
			for(var i = 0, ii = self.sketcher.dialogManager.periodicTableDialog.canvas.cells.length; i<ii; i++){
				var cell = self.sketcher.dialogManager.periodicTableDialog.canvas.cells[i];
				if(cell.element.symbol==self.sketcher.stateManager.STATE_LABEL.label){
					self.sketcher.dialogManager.periodicTableDialog.canvas.selected = cell;
					self.sketcher.dialogManager.periodicTableDialog.canvas.repaint();
					break;
				}
			}
			self.sketcher.dialogManager.periodicTableDialog.getElement().dialog('open');
		}));
	};
	gui.ToolbarManager.prototype.makeBondSet = function(self) {
		this.bondSet = new desktop.ButtonSet(self.sketcher.id+'_buttons_bond');
		this.buttonSingle = new desktop.Button(self.sketcher.id+'_button_bond_single', self.sketcher.iconPath, 'SingleBond', 'Single Bond', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_BOND;
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 1;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_NONE;
		});
		this.bondSet.buttons.push(this.buttonSingle);
		this.buttonRecessed = new desktop.Button(self.sketcher.id+'_button_bond_recessed', self.sketcher.iconPath, 'RecessedBond', 'Recessed Bond', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_BOND;
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 1;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_RECESSED;
		});
		this.bondSet.buttons.push(this.buttonRecessed);
		this.buttonProtruding = new desktop.Button(self.sketcher.id+'_button_bond_protruding', self.sketcher.iconPath, 'ProtrudingBond', 'Protruding Bond', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_BOND;
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 1;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_PROTRUDING;
		});
		this.bondSet.buttons.push(this.buttonProtruding);
		this.buttonDouble = new desktop.Button(self.sketcher.id+'_button_bond_double', self.sketcher.iconPath, 'DoubleBond', 'Double Bond', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_BOND;
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 2;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_NONE;
		});
		this.bondSet.buttons.push(this.buttonDouble);
		this.buttonBond = new desktop.DummyButton(self.sketcher.id+'_button_bond', self.sketcher.iconPath, 'TripleBond', 'Other Bond');
		this.bondSet.buttons.push(this.buttonBond);
		this.bondSet.addDropDown('More Bonds', self.sketcher.iconPath);
		this.bondSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_bond_triple', self.sketcher.iconPath, 'TripleBond', 'Triple Bond', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_BOND;
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 3;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_NONE;
		}));
		this.bondSet.dropDown.defaultButton = this.bondSet.dropDown.buttonSet.buttons[this.bondSet.dropDown.buttonSet.buttons.length - 1];
		this.bondSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_bond_ambiguous_double', self.sketcher.iconPath, 'AmbiguousDoubleBond', 'Ambiguous Double Bond', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_BOND;
			self.sketcher.stateManager.STATE_NEW_BOND.bondOrder = 2;
			self.sketcher.stateManager.STATE_NEW_BOND.stereo = structures.Bond.STEREO_AMBIGUOUS;
		}));
	};
	gui.ToolbarManager.prototype.makeRingSet = function(self) {
		this.ringSet = new desktop.ButtonSet(self.sketcher.id+'_buttons_ring');
		this.buttonCyclohexane = new desktop.Button(self.sketcher.id+'_button_ring_cyclohexane', self.sketcher.iconPath, 'Cyclohexane', 'Cyclohexane Ring', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_RING;
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 6;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		});
		this.ringSet.buttons.push(this.buttonCyclohexane);
		this.buttonBenzene = new desktop.Button(self.sketcher.id+'_button_ring_benzene', self.sketcher.iconPath, 'Benzene', 'Benzene Ring', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_RING;
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 6;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = true;
		});
		this.ringSet.buttons.push(this.buttonBenzene);
		this.buttonBond = new desktop.DummyButton(self.sketcher.id+'_button_ring', self.sketcher.iconPath, 'Cyclopentane', 'Other Ring');
		this.ringSet.buttons.push(this.buttonBond);
		this.ringSet.addDropDown('More Rings', self.sketcher.iconPath);
		this.ringSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_ring_cyclopropane', self.sketcher.iconPath, 'Cyclopropane', 'Cyclopropane Ring', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_RING;
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 3;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		}));
		this.ringSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_ring_cyclobutane', self.sketcher.iconPath, 'Cyclobutane', 'Cyclobutane Ring', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_RING;
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 4;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		}));
		this.ringSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_ring_cyclopentane', self.sketcher.iconPath, 'Cyclopentane', 'Cyclopentane Ring', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_RING;
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 5;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		}));
		this.ringSet.dropDown.defaultButton = this.ringSet.dropDown.buttonSet.buttons[this.ringSet.dropDown.buttonSet.buttons.length - 1];
		this.ringSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_ring_cycloheptane', self.sketcher.iconPath, 'Cycloheptane', 'Cycloheptane Ring', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_RING;
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 7;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		}));
		this.ringSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_ring_cyclooctane', self.sketcher.iconPath, 'Cyclooctane', 'Cyclooctane Ring', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_NEW_RING;
			self.sketcher.stateManager.STATE_NEW_RING.numSides = 8;
			self.sketcher.stateManager.STATE_NEW_RING.unsaturated = false;
		}));
	};
	gui.ToolbarManager.prototype.makeAttributeSet = function(self) {
		this.attributeSet = new desktop.ButtonSet(self.sketcher.id+'_buttons_attribute');
		this.buttonChargePlus = new desktop.Button(self.sketcher.id+'_button_attribute_charge_increment', self.sketcher.iconPath, 'IncreaseCharge', 'Increase Charge', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_CHARGE;
			self.sketcher.stateManager.STATE_CHARGE.delta = 1;
		});
		this.attributeSet.buttons.push(this.buttonChargePlus);
		this.buttonAttribute = new desktop.DummyButton(self.sketcher.id+'_button_attribute', self.sketcher.iconPath, 'DecreaseCharge', 'Other Attribute');
		this.attributeSet.buttons.push(this.buttonAttribute);
		this.attributeSet.addDropDown('More Attributes', self.sketcher.iconPath);
		this.attributeSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_attribute_charge_decrement', self.sketcher.iconPath, 'DecreaseCharge', 'Decrease Charge', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_CHARGE;
			self.sketcher.stateManager.STATE_CHARGE.delta = -1;
		}));
		this.attributeSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_attribute_lonePair_increment', self.sketcher.iconPath, 'AddLonePair', 'Add Lone Pair', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LONE_PAIR;
			self.sketcher.stateManager.STATE_LONE_PAIR.delta = 1;
		}));
		this.attributeSet.dropDown.buttonSet.buttons.push(new desktop.Button(self.sketcher.id+'_button_attribute_lonePair_decrement', self.sketcher.iconPath, 'RemoveLonePair', 'Remove Lone Pair', function() {
			self.sketcher.stateManager.currentState = self.sketcher.stateManager.STATE_LONE_PAIR;
			self.sketcher.stateManager.STATE_LONE_PAIR.delta = -1;
		}));
	};

})(ChemDoodle, ChemDoodle.iChemLabs, ChemDoodle.io, ChemDoodle.sketcher.actions, ChemDoodle.sketcher.gui, ChemDoodle.sketcher.gui.desktop, ChemDoodle.structures, jQuery, document);

//
//  Copyright 2009 iChemLabs, LLC.  All rights reserved.
//
//  $Revision: 3472 $
//  $Author: kevin $
//  $LastChangedDate: 2012-01-27 16:16:37 -0500 (Fri, 27 Jan 2012) $
//

(function(c, extensions, sketcherPack, structures, q, m, window) {

	c.SketcherCanvas = function(id, width, height, iconPath, isMobile, useServices) {
		var self = this;
		this.iconPath = iconPath;
		this.isMobile = isMobile;
		this.useServices = useServices;
		// toolbar manager needs the sketcher id to make it unique to this
		// canvas
		this.id = id;
		this.toolbarManager = new sketcherPack.gui.ToolbarManager(this);
		if (iconPath != null) {
			this.toolbarManager.write();
			q(window).load(function() {
				self.toolbarManager.setup();
			});
			this.dialogManager = new sketcherPack.gui.DialogManager(this);
		}
		this.stateManager = new sketcherPack.states.StateManager(this);
		this.historyManager = new sketcherPack.actions.HistoryManager(this);
		if (id) {
			this.create(id, width, height);
		}
		this.specs.atoms_circleDiameter_2D = 7;
		this.specs.atoms_circleBorderWidth_2D = 0;
		this.isHelp = false;
		this.helpPos = new structures.Point(this.width - 20, 20);
		this.clear();
		this.lastPinchScale = 1;
		this.lastGestureRotate = 0;
		return true;
	};
	c.SketcherCanvas.prototype = new c._Canvas();
	c.SketcherCanvas.prototype.clear = function() {
		var molecule = new structures.Molecule();
		molecule.atoms[0] = new structures.Atom('C', 0, 0, 0);
		this.loadMolecule(molecule);
	};
	c.SketcherCanvas.prototype.drawSketcherDecorations = function(ctx) {
		ctx.save();
		ctx.translate(this.width / 2, this.height / 2);
		ctx.rotate(this.specs.rotateAngle);
		ctx.scale(this.specs.scale, this.specs.scale);
		ctx.translate(-this.width / 2, -this.height / 2);
		if (this.hovering != null) {
			this.hovering.drawDecorations(ctx);
		}
		if (this.tempAtom != null) {
			ctx.strokeStyle = '#00FF00';
			ctx.fillStyle = '#00FF00';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.hovering.x, this.hovering.y);
			extensions.contextHashTo(ctx, this.hovering.x, this.hovering.y, this.tempAtom.x, this.tempAtom.y, 2, 2);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(this.tempAtom.x, this.tempAtom.y, 3, 0, m.PI * 2, false);
			ctx.fill();
			if (this.tempAtom.isOverlap) {
				ctx.strokeStyle = '#C10000';
				ctx.lineWidth = 1.2;
				ctx.beginPath();
				ctx.arc(this.tempAtom.x, this.tempAtom.y, 7, 0, m.PI * 2, false);
				ctx.stroke();
			}
		}
		if (this.tempRing != null) {
			ctx.strokeStyle = '#00FF00';
			ctx.fillStyle = '#00FF00';
			ctx.lineWidth = 1;
			ctx.beginPath();
			if (this.hovering instanceof structures.Atom) {
				ctx.moveTo(this.hovering.x, this.hovering.y);
				extensions.contextHashTo(ctx, this.hovering.x, this.hovering.y, this.tempRing[0].x, this.tempRing[0].y, 2, 2);
				for ( var i = 1, ii = this.tempRing.length; i < ii; i++) {
					extensions.contextHashTo(ctx, this.tempRing[i - 1].x, this.tempRing[i - 1].y, this.tempRing[i].x, this.tempRing[i].y, 2, 2);
				}
				extensions.contextHashTo(ctx, this.tempRing[this.tempRing.length - 1].x, this.tempRing[this.tempRing.length - 1].y, this.hovering.x, this.hovering.y, 2, 2);
			} else if (this.hovering instanceof structures.Bond) {
				var start = this.hovering.a2;
				var end = this.hovering.a1;
				if (this.tempRing[0] == this.hovering.a1) {
					start = this.hovering.a1;
					end = this.hovering.a2;
				}
				ctx.moveTo(start.x, start.y);
				extensions.contextHashTo(ctx, start.x, start.y, this.tempRing[1].x, this.tempRing[1].y, 2, 2);
				for ( var i = 2, ii = this.tempRing.length; i < ii; i++) {
					extensions.contextHashTo(ctx, this.tempRing[i - 1].x, this.tempRing[i - 1].y, this.tempRing[i].x, this.tempRing[i].y, 2, 2);
				}
				extensions.contextHashTo(ctx, this.tempRing[this.tempRing.length - 1].x, this.tempRing[this.tempRing.length - 1].y, end.x, end.y, 2, 2);
			}
			ctx.stroke();
			for ( var i = 0, ii = this.molecule.atoms.length; i < ii; i++) {
				if (this.molecule.atoms[i].isOverlap) {
					ctx.strokeStyle = '#C10000';
					ctx.lineWidth = 1.2;
					ctx.beginPath();
					ctx.arc(this.molecule.atoms[i].x, this.molecule.atoms[i].y, 7, 0, m.PI * 2, false);
					ctx.stroke();
				}
			}
		}
		ctx.restore();
	};
	c.SketcherCanvas.prototype.drawChildExtras = function(ctx) {
		this.drawSketcherDecorations(ctx);
		if (!this.hideHelp) {
			// help and tutorial
			var radgrad = ctx.createRadialGradient(this.width - 20, 20, 10, this.width - 20, 20, 2);
			radgrad.addColorStop(0, '#00680F');
			radgrad.addColorStop(1, '#FFFFFF');
			ctx.fillStyle = radgrad;
			ctx.beginPath();
			ctx.arc(this.helpPos.x, this.helpPos.y, 10, 0, m.PI * 2, false);
			ctx.fill();
			if (this.isHelp) {
				ctx.lineWidth = 2;
				ctx.strokeStyle = 'black';
				ctx.stroke();
			}
			ctx.fillStyle = this.isHelp ? 'red' : 'black';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.font = '14px sans-serif';
			ctx.fillText('?', this.helpPos.x, this.helpPos.y);
		}
		if (!this.paidToHideTrademark) {
			// You must keep this name displayed at all times to abide by the
			// license
			// Contact us for permission to remove it,
			// http://www.ichemlabs.com/contact-us
			var name = 'ChemDoodle';
			var width = ctx.measureText(name).width;
			ctx.textAlign = 'left';
			ctx.textBaseline = 'bottom';
			ctx.fillStyle = 'rgba(0, 90, 0, 0.5)';
			ctx.fillText(name, this.width - width - 18, this.height - 4);
			ctx.font = '8px sans-serif';
			ctx.fillText('TM', this.width - 18, this.height - 12);
		}
	};
	c.SketcherCanvas.prototype.scaleEvent = function(e) {
		e.op = new structures.Point(e.p.x, e.p.y);
		if (this.specs.scale != 1) {
			e.p.x = this.width / 2 + (e.p.x - this.width / 2) / this.specs.scale;
			e.p.y = this.height / 2 + (e.p.y - this.height / 2) / this.specs.scale;
		}
	};
	c.SketcherCanvas.prototype.checkScale = function() {
		if (this.specs.scale < .5) {
			this.specs.scale = .5;
		} else if (this.specs.scale > 10) {
			this.specs.scale = 10;
		}
	};
	// desktop events
	c.SketcherCanvas.prototype.click = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.click(e);
	};
	c.SketcherCanvas.prototype.rightclick = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.rightclick(e);
	};
	c.SketcherCanvas.prototype.dblclick = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.dblclick(e);
	};
	c.SketcherCanvas.prototype.mousedown = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.mousedown(e);
	};
	c.SketcherCanvas.prototype.rightmousedown = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.rightmousedown(e);
	};
	c.SketcherCanvas.prototype.mousemove = function(e) {
		// link to tutorial
		this.isHelp = false;
		if (e.p.distance(this.helpPos) < 10) {
			this.isHelp = true;
		}
		this.scaleEvent(e);
		this.stateManager.currentState.mousemove(e);
		// repaint is called in the state mousemove event
	};
	c.SketcherCanvas.prototype.mouseout = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.mouseout(e);
	};
	c.SketcherCanvas.prototype.mouseover = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.mouseover(e);
	};
	c.SketcherCanvas.prototype.mouseup = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.mouseup(e);
	};
	c.SketcherCanvas.prototype.rightmouseup = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.rightmouseup(e);
	};
	c.SketcherCanvas.prototype.mousewheel = function(e, delta) {
		this.scaleEvent(e);
		this.stateManager.currentState.mousewheel(e, delta);
	};
	c.SketcherCanvas.prototype.drag = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.drag(e);
	};
	c.SketcherCanvas.prototype.keydown = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.keydown(e);
	};
	c.SketcherCanvas.prototype.keypress = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.keypress(e);
	};
	c.SketcherCanvas.prototype.keyup = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.keyup(e);
	};
	c.SketcherCanvas.prototype.touchstart = function(e) {
		if (e.originalEvent.touches && e.originalEvent.touches.length > 1) {
			if (this.tempAtom != null || this.tempRing != null) {
				this.tempAtom = null;
				this.tempRing = null;
				this.hovering = null;
				this.repaint();
			}
			this.lastPoint = null;
		} else {
			this.scaleEvent(e);
			this.stateManager.currentState.mousemove(e);
			this.stateManager.currentState.mousedown(e);
		}
	};
	c.SketcherCanvas.prototype.touchmove = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.drag(e);
	};
	c.SketcherCanvas.prototype.touchend = function(e) {
		this.scaleEvent(e);
		this.stateManager.currentState.mouseup(e);
		if (this.hovering != null) {
			this.stateManager.currentState.clearHover();
			this.repaint();
		}
	};
	c.SketcherCanvas.prototype.gesturechange = function(e) {
		if (e.originalEvent.scale - this.lastPinchScale != 1) {
			this.specs.scale *= e.originalEvent.scale / this.lastPinchScale;
			this.checkScale();
			this.lastPinchScale = e.originalEvent.scale;
		}
		if (this.lastGestureRotate - e.originalEvent.rotation != 0) {
			var rot = (this.lastGestureRotate - e.originalEvent.rotation) / 180 * m.PI;
			var center = new structures.Point(this.width / 2, this.height / 2);
			if (this.parentAction == null) {
				this.parentAction = new sketcherPack.actions.RotateAction(this.molecule.atoms, rot, center);
				this.historyManager.pushUndo(this.parentAction);
			} else {
				this.parentAction.dif += rot;
				for ( var i = 0, ii = this.molecule.atoms.length; i < ii; i++) {
					var dist = center.distance(this.molecule.atoms[i]);
					var angle = center.angle(this.molecule.atoms[i]) + rot;
					this.molecule.atoms[i].x = center.x + dist * m.cos(angle);
					this.molecule.atoms[i].y = center.y - dist * m.sin(angle);
				}
				// must check here as change is outside of an action
				this.molecule.check();
			}
			this.lastGestureRotate = e.originalEvent.rotation;
		}
		this.repaint();
	};
	c.SketcherCanvas.prototype.gestureend = function(e) {
		this.lastPinchScale = 1;
		this.lastGestureRotate = 0;
		this.parentAction = null;
	};

})(ChemDoodle, ChemDoodle.extensions, ChemDoodle.sketcher, ChemDoodle.structures, jQuery, Math, window);
