Measurement Common
==================

A set of common json files for measurement. These detail the systems and units available for conversion.

## JSON Structure

The json structure defines a set of systems, where each system contains a set of units.

### Example Structure
```json
{
	"systems": {
		...
		"force": {
			"symbol": "F",
			"otherNames": [ "weight" ],
			"baseUnit": "newton",
			"derived": "mass*length/time/time",
			"units": {
				"newton": {
					"symbol": "N",
					"type": "si"
				},
				...
				"milligraveForce": {
					"symbol": "mGf",
					"otherSymbols": ["gf"],
					"otherNames": ["gravet-force"],
					"type": "customary",
					"multiplier": 9.80665e-3
				},
				...
			}
		}
		...
	}
}
```

### Fields
Systems and units have the following properties. All properties are strings unless otherwise defined.

 - **Measurement Systems**
  - *name* - A formal name for the measurement system
  - *inherits* - (optional) The key of the measurement system that it inherits from
  - *historical* - (optional, boolean) Determines if the system is in common usage
 - **Systems**
  - *symbol* - The symbol that is generally used to represent that system
  - *otherNames* - (optional, array) Other names used for the system
  - *baseUnit* - The name of the unit that should be used as the base unit that all multipliers and adjustments are based off
  - *derived* - (optional) Many systems can be derived from base systems that can't be derived from anything else. e.g. speed is "length/time"
 - **Units**
  - *symbol* - The symbol that is most commonlly used to represent the unit
  - *type* - The type of unit it is: si, customary, or range.
    - **customary** - Can be displayed as a raw value only. SI calls this "off-system"
    - **si** - Part of the SI system, as such may use SI prefixes (e.g. milli, micro, kilo, mega etc)
    - **range** - The unit is a set of ranges, the name of the range must be displayed rather than a value. (e.g. oven temperature of 'Medium')
    - **binary** - (undecided) Either true or false in representation
    - **fractional** - (undecided) May only be displayed as a fraction
    - **whole** - (undecided) May only be displayed as a whole number
  - *otherSymbols* - (optional, array) The strings of other symbols that represent the unit
  - *otherNames* - (optional, array) The strings of other names of the unit - e.g. a 'bit' can also be called a 'shannon'
  - *multiplier* - (optional, number) This should be defined on any unit that is not the base unit. Provides a linear multiplier for conversions. (baseUnit amount x multiplier) + offset = convertedUnit amount
  - *offset* - (optional) This should be defined on any unit where baseUnit != 0 if convertedUnit = 0.
  - *estimation* - (optional, boolean) This should be set to true if the conversion is not exact
  - *systems* - (array) This provides a list of the types of systems (e.g. US Customary, CGS etc) where the unit is used. See "Measurement Systems".
  - *rare* - (optional, boolean) This should be set to true if the unit is rarely used within the systems it is part of.
  - *notes* - (optional) Any useful additional details
  - *prefixName* - (optional) **Only to be used on base units which are SI and have a prefix (e.g. kilogram)** Name of the existing prefix
  - *prefixFreeName* - (optional) **Only to be used on base units which are SI and have a prefix (e.g. kilogram)** Name of the unit without prefix

## Measurement Systems Hierarchy
We have constructed a (flattened) hierarchy of measurement systems that represent the usages of units in the real world while minimising the measurement systems needing
to be detailed against each unit.
Each unit should be marked with at least one measurement system.

 - metric
  - si
    - siCommon
      - australia
      - canada
    - astronomical
   - legacyMetric *(H)*
     - cgs *(H)*
     - mts *(H)*
     - mks *(H)*
     - gravitational *(H)*
 - imperial
   - englishEngineering *(H)*
   - britishGravitational *(H)*
   - absoluteEnglish *(H)*
 - usCustomary
   - avoirdupois
 - englishUnits *(H)*
   - apothecaries *(H)*
   - troy *(H)*
 - nonStandard
 - traditionalChinese *(H)*

## Base Systems
We utilise the standard SI systems and their base units. All systems *should* be able to be derived from these systems.

 - Time (second)
 - Length (metre)
 - Mass (kilogram)
 - Amount of Substance (mole)
 - Luminous Intensity (candela)
 - Electric Current (ampere)
 - Temperature (kelvin)
 - Plane Angle (radian)
 - *Solid Angle (steradian)* - This is a bit of an exception, a solid angle is a 2D angle in 3D space that is represented using a dimensionless unit.

## Sources

 - BIPM. (2014) *SI brochure*. Retrieved from: http://www.bipm.org/en/si/si_brochure/
 - Dresner, Stephen. (1971). *Units of Measurement*. Aylesbury, England: Harvey Miller and Medcalf Ltd
 - Google. (2014). *Unit Conversion Calculator*. Retrieved from: http://www.google.com/intl/en/help/features.html#reference
 - Wikipedia. (2014) *Conversion of units*. Retrieved from: http://en.wikipedia.org/wiki/Conversion_of_units

## License
Measurement JS is freely distributable under the terms of the MIT license.
