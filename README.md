Measurement Common
==================

A set of common json files for measurement. These detail the dimensions, systems, prefixes and units available.

## JSON Structure

The json structure defines the following:
 - A set of systems, which describe man-made systems of units that allow the measurement of dimensions. Systems may be based on another system and thus can inherit from that system.
 - A set of dimensions in the physical world, where each dimension contains a set of units that can be used to measure it. Each unit belongs to one or more systems.
 - A set of prefixes used by different units.

### Example Structure
```json
{
	"systems": {
		...
		"cgs": {
			"name": "Centimetre-Gram-Second Unit System",
			"historical": true,
			"inherits": "legacyMetric"
		},
		...
	},
	"dimensions": {
		...
		"force": {
			"symbol": "F",
			"otherNames": ["weight"],
			"baseUnit": "newton",
			"derived": "mass*length/time/time",
			"units": {
				"newton": {
					"symbol": "N",
					"type": "si",
					"systems": ["si"],
				},
				...
				"milligraveForce": {
					"symbol": "mGf",
					"otherSymbols": ["gf"],
					"otherNames": ["gravet-force"],
					"type": "customary",
					"systems": ["gravitational"],
					"multiplier": 9.80665e-3
				},
				...
			}
		}
		...
	},
	"prefixes": {
		...
		"kilo": {
			"symbol": "k",
			"type": "si",
			"multiplier": 1e3
		},
		...
	}
}
```

### Fields
Systems, dimensions, and units have the following properties. All properties are strings unless otherwise defined.

 - **Systems**
  - *name* - A formal name for the system
  - *inherits* - (optional) The key of the system that it inherits from
  - *historical* - (optional, boolean) Determines if the system is in common usage
 - **Dimensions**
  - *symbol* - The symbol that is generally used to represent that dimension
  - *otherNames* - (optional, array) Other names used for the dimension
  - *baseUnit* - The name of the unit that should be used as the base unit that all multipliers and adjustments are based off
  - *derived* - (optional) Many dimensions can be derived from base dimensions that can't be derived from anything else. e.g. speed is "length/time"
 - **Units**
  - *symbol* - The symbol that is most commonlly used to represent the unit
  - *type* - The type of unit it is: si, customary, or range.
    - **customary** - Can be displayed as a raw value only. SI calls this "off-system"
    - **si** - Part of the SI system, as such may use SI prefixes (e.g. milli, micro, kilo, mega etc)
    - **range** - The unit is a set of ranges, the name of the range must be displayed rather than a value. (e.g. oven temperature of 'Medium')
    - **binary** - (undecided) Either true or false in representation
    - **fractional** - (undecided) May only be displayed as a fraction
    - **whole** - (undecided) May only be displayed as a whole number
  - *systems* - (array) This provides a list of the types of systems (e.g. US Customary, CGS etc) where the unit is used. See "Systems".
  - *otherSymbols* - (optional, array) The strings of other symbols that represent the unit
  - *otherNames* - (optional, array) The strings of other names of the unit - e.g. a 'bit' can also be called a 'shannon'
  - *multiplier* - (optional, number) This should be defined on any unit that is not the base unit. Provides a linear multiplier for conversions. (baseUnit amount x multiplier) + offset = convertedUnit amount
  - *offset* - (optional) This should be defined on any unit where baseUnit != 0 if convertedUnit = 0.
  - *estimation* - (optional, boolean) This should be set to true if the conversion is not exact
  - *rare* - (optional, boolean) This should be set to true if the unit is rarely used within the systems it is part of.
  - *notes* - (optional) Any useful additional details
  - *prefixName* - (optional) **Only to be used on base units which are SI and have a prefix (e.g. kilogram)** Name of the existing prefix
  - *prefixFreeName* - (optional) **Only to be used on base units which are SI and have a prefix (e.g. kilogram)** Name of the unit without prefix

## Systems Hierarchy
We have constructed a (flattened) hierarchy of systems that represent the usages of units in the real world while minimising the systems needing
to be detailed against each unit.
Each unit should be marked with at least one system.

 - metric (Metric System)
  - si (International System of Units)
   - astronomical (Astronomical Units)
   - siCommon (Common Non-Scientific Metric (SI))
    - australia (Common Australian Metric (SI))
    - canada (Common Canadian Metric (SI))
  - legacyMetric (Legacy Metric Systems) *(H)*
   - cgs (Centimetre-Gram-Second Unit System) *(H)*
   - mts (Metre-Tonne-Second Unit System) *(H)*
   - mks (Metre-Kilogramme-Second Unit System) *(H)*
   - gravitational (Gravitational Metric System) *(H)*
 - internationalNautical (International Nautical Measure)
 - imperial (UK Imperial Units)
  - imperialNautical (Imperial Nautical Units) *(H)*
  - englishEngineering (English Engineering System) *(H)*
  - britishGravitational (British Gravitational System) *(H)*
  - absoluteEnglish (Absolute English System) *(H)*
 - usCustomary (US Customary Units)
  - avoirdupois (Avoirdupois Units)
  - usSurvey (US Survey Units)
  - usNautical (International Nautical Units)
  - usFoodNutrition (US Food Nutrition Labeling Units)
 - englishUnits (Traditional English Units) *(H)*
  - apothecaries (Apothecaries' Units) *(H)*
  - troy (Troy Weight) *(H)*
 - nonStandard (Non-Standard Units)
 - traditionalChinese (Traditional Chinese Units) *(H)*
 - oldEuropean (Old European Units) *(H)*
 - ancient (Ancient Units) *(H)*
  - biblical (Biblical Units) *(H)*
  - ancientRoman (Ancient Roman Units) *(H)*

## Base Dimensions
We utilise the standard SI dimensions and their base units. All dimensions *should* be able to be derived from these dimensions.

 - Time (second)
 - Length (metre)
 - Mass (kilogram)
 - Amount of Substance (mole)
 - Luminous Intensity (candela)
 - Electric Current (ampere)
 - Temperature (kelvin)
 - Plane Angle (radian)
 - *Solid Angle (steradian)* - This is a bit of an exception, a solid angle is a 2D angle in 3D space that is represented using a dimensionless unit.

## Derived Dimensions

 - Volume (cubicMetre)
 - Area (squareMetre)
 - Frequency (hertz)
 - Force (newton)
 - Speed (metrePerSecond)
 - Acceleration (metrePerSquareSecond)
 - Energy (joule)
 - Power (watt)
 - Electric Charge (coulomb)
 - Electric Dipole Moment (coulombMetre)
 - Electric Potential (volt)
 - Electric Resistance (ohm)
 - Capacitance (farad)
 - Inductance (henry)
 - Density (kilogramPerCubicMetre)
 - Flow Volume (cubicMetrePerSecond)
 - Luminance (candelaPerSquareMetre)
 - Luminous Flux (lumen)
 - Illumiance (lux)
 - Magnetic Flux (weber)
 - Magnetic Flux Density (tesla)
 - Magnetic Field Strength (amperePerMetre)
 - Kinematic Viscosity (squareMetrePerSecond)
 - Dynamic Viscosity (pascalSecond)
 - Action (jouleSecond)
 - Torque (newtonMetre)
 - Information (bit)

## ToDo
 - Add otherMultipliers to provide alt scale factors (maybe rename multiplier to factor or scaleFactor)
 - Allow not having a symbol in case where the name == symbol
 - Deal with Gaussian cgs a subset of cgs as it's own system
 - Ability to prefer base units for units like: amperePerMetre, candelaPerSquareMetre, pascalSecond etc
 - Should atomic units have their own system? sub system of si? i.e. siAtomic
 - Add dimension property "dimensionless" to plane angle and solid angle (not technically base dimensions)
 - Add 'tags' to units - know tags would be dry, fluid, cooking, physics, math etc
 - Needed Dimensions
  - electric flux (ΦE Φₑ - volt metre)
  - electric field strength (E - volt per metre)
  - electric displacement field (D - coloumb per square metre)
  - Permittivity (ε - Fara per metre)
  - Electric susceptibility (χₑ or Xₑ - dimensionless)
  - Magnetic susceptibility (χ or X - dimensionless)
  - Resistivity (ρ - ohm metre)
  - Conductance; Admittance; Susceptance (G; Y; B - siemens)
  - Conductivity (κ, γ, σ - siemens per metre)
  - Permeability (μ - henry per metre)
  - radioactivity (becquerel)
  - absorbedDose (gray)
  - equivalentDose (sievert)
  - catalyticActivity (katal)
  - levelOfFieldQuantity (neper, bel, decibel)
  - levelOfPowerQuantity (neper, bel, decibel)
  - electricQuadrupole (buckingham?)

## Adopted Conventions

 - The default spelling is "metre" not "meter", though we try to provide the alternative.
 - Names of units describe the positive dimensions (numerator) before the negative dimensions (denominator) e.g. xPerY
 - When a base unit has a absolute power greater than 1, the term "square" or "cubic" should proceed the base unit name.
 - Unless otherwise specified units described are at a standard atmospheric pressure and room temperature.

## Sources

 - BIPM. (2014) *SI brochure*. Retrieved from: http://www.bipm.org/en/si/si_brochure/
 - Dresner, Stephen. (1971). *Units of Measurement*. Aylesbury, England: Harvey Miller and Medcalf Ltd
 - Google. (2014). *Unit Conversion Calculator*. Retrieved from: http://www.google.com/intl/en/help/features.html#reference
 - Wikipedia. (2014) *Conversion of units*. Retrieved from: http://en.wikipedia.org/wiki/Conversion_of_units
 - Wikipedia. (2014) *Ancient Roman units of measurement*. Retrieved from: http://en.wikipedia.org/wiki/Ancient_Roman_units_of_measurement
 - Wikipedia (2014) *Ohm*. Retrieved from: http://en.wikipedia.org/wiki/Ohm
 - Wikipedia (2014) *SI electromagnetism units*. Retrieved from: http://en.wikipedia.org/wiki/SI_electromagnetism_units
 - TranslatorsCafe.com (2014) *Electrical Resistance*. Retrieved from: http://www.translatorscafe.com/cafe/EN/units-converter/electric-resistance

## License
Measurement Common is freely distributable under the terms of the MIT license.
