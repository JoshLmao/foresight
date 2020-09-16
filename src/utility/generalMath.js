/// Adds together stacked multiple sources as percentages to get their actual total as a percent
/// Also known as multiplicative stacking
/// 1 - (1 - sourceOne) * (1 - sourceTwo) * (1 - sourceThree) ...etc
export function calculateMultiplicativeStackingTotal(allStackedSources) {
    if (!allStackedSources || (allStackedSources && allStackedSources.length <= 0)) {
        return 0;
    }

    // Divide original value into 0.x and minus from 1 to get the reverse
    let decimals = []
    for(let source of allStackedSources) {
        decimals.push(1 - (source / 100));
    }

    // multiply them all together 
    let total = decimals[0];
    for(let i = 1; i < decimals.length; i++) {
        total *= decimals[i];
    }
 
    // then minus from 1, and multiply by 100 to get value as a percentage
    let percent = (1 - total) * 100;
    return percent;
}