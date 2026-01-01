// ============================================================================
// RESTART STRESS TEST
// ============================================================================
// Automated test to verify draw call stability across multiple restarts
// Usage: Open browser console and run: runRestartTest()
// ============================================================================

async function restartStressTest() {
    console.log('🧪 ══════════════════════════════════════════════════════');
    console.log('🧪 RESTART STRESS TEST - 10 Restarts');
    console.log('🧪 ══════════════════════════════════════════════════════');
    console.log('📝 Test will restart game 10 times and measure metrics');
    console.log('⏱️  Estimated time: ~15 seconds\n');

    const metrics = [];

    for (let i = 0; i < 10; i++) {
        console.log(`\n🔄 Restart ${i + 1}/10...`);

        // Wait for system to stabilize
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture BEFORE metrics
        const beforeDrawCalls = renderer.info.render.calls;
        const beforeSceneChildren = scene.children.length;

        // Trigger restart
        resetGame();

        // Wait for cleanup and re-initialization
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Capture AFTER metrics
        const afterMetrics = {
            restart: i + 1,
            drawCalls: renderer.info.render.calls,
            triangles: renderer.info.render.triangles,
            sceneChildren: scene.children.length,
            geometries: renderer.info.memory.geometries,
            textures: renderer.info.memory.textures,
            pipes: pipes.length,
            clouds: clouds.length,
            powerUps: powerUps.length,
            roadSegments: roadSegments.length
        };

        // Add memory if available (Chrome only)
        if (performance.memory) {
            afterMetrics.heapMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
        }

        metrics.push(afterMetrics);

        console.log(`✓ Restart ${i + 1} complete:`, {
            drawCalls: afterMetrics.drawCalls,
            sceneChildren: afterMetrics.sceneChildren,
            geometries: afterMetrics.geometries
        });
    }

    console.log('\n🧪 ══════════════════════════════════════════════════════');
    console.log('🧪 TEST RESULTS');
    console.log('🧪 ══════════════════════════════════════════════════════\n');
    console.table(metrics);

    // Analysis
    console.log('\n📊 STABILITY ANALYSIS:');
    console.log('─────────────────────────────────────────────────────────');

    const firstDrawCalls = metrics[0].drawCalls;
    const lastDrawCalls = metrics[9].drawCalls;
    const drawCallGrowth = ((lastDrawCalls - firstDrawCalls) / firstDrawCalls * 100);

    const firstSceneChildren = metrics[0].sceneChildren;
    const lastSceneChildren = metrics[9].sceneChildren;
    const sceneGrowth = ((lastSceneChildren - firstSceneChildren) / firstSceneChildren * 100);

    const firstGeometries = metrics[0].geometries;
    const lastGeometries = metrics[9].geometries;
    const geoGrowth = ((lastGeometries - firstGeometries) / firstGeometries * 100);

    console.log('Draw Calls:');
    console.log(`  First restart: ${firstDrawCalls}`);
    console.log(`  Last restart:  ${lastDrawCalls}`);
    console.log(`  Growth:        ${drawCallGrowth.toFixed(1)}%`);

    console.log('\nScene Children:');
    console.log(`  First restart: ${firstSceneChildren}`);
    console.log(`  Last restart:  ${lastSceneChildren}`);
    console.log(`  Growth:        ${sceneGrowth.toFixed(1)}%`);

    console.log('\nGeometries:');
    console.log(`  First restart: ${firstGeometries}`);
    console.log(`  Last restart:  ${lastGeometries}`);
    console.log(`  Growth:        ${geoGrowth.toFixed(1)}%`);

    if (performance.memory) {
        const firstHeap = parseFloat(metrics[0].heapMB);
        const lastHeap = parseFloat(metrics[9].heapMB);
        const heapGrowth = ((lastHeap - firstHeap) / firstHeap * 100);

        console.log('\nJS Heap Memory:');
        console.log(`  First restart: ${firstHeap.toFixed(1)} MB`);
        console.log(`  Last restart:  ${lastHeap.toFixed(1)} MB`);
        console.log(`  Growth:        ${heapGrowth.toFixed(1)}%`);
    }

    console.log('\n🎯 PASS/FAIL CRITERIA:');
    console.log('─────────────────────────────────────────────────────────');

    // Pass criteria: < 5% growth
    const GROWTH_THRESHOLD = 5;

    const drawCallPass = Math.abs(drawCallGrowth) < GROWTH_THRESHOLD;
    const scenePass = Math.abs(sceneGrowth) < GROWTH_THRESHOLD;
    const geoPass = Math.abs(geoGrowth) < GROWTH_THRESHOLD;

    console.log(`Draw Call Stability:  ${drawCallPass ? '✅ PASS' : '❌ FAIL'} (${drawCallGrowth.toFixed(1)}% growth, threshold: ±${GROWTH_THRESHOLD}%)`);
    console.log(`Scene Stability:      ${scenePass ? '✅ PASS' : '❌ FAIL'} (${sceneGrowth.toFixed(1)}% growth, threshold: ±${GROWTH_THRESHOLD}%)`);
    console.log(`Geometry Stability:   ${geoPass ? '✅ PASS' : '❌ FAIL'} (${geoGrowth.toFixed(1)}% growth, threshold: ±${GROWTH_THRESHOLD}%)`);

    const allPassed = drawCallPass && scenePass && geoPass;

    console.log('\n🧪 ══════════════════════════════════════════════════════');
    if (allPassed) {
        console.log('✅ TEST PASSED: All metrics stable across 10 restarts!');
    } else {
        console.log('❌ TEST FAILED: Memory leaks detected!');
        console.log('📝 Check metrics above for growing values.');
    }
    console.log('🧪 ══════════════════════════════════════════════════════\n');

    return {
        passed: allPassed,
        metrics: metrics,
        analysis: {
            drawCallGrowth: drawCallGrowth.toFixed(1) + '%',
            sceneGrowth: sceneGrowth.toFixed(1) + '%',
            geoGrowth: geoGrowth.toFixed(1) + '%'
        }
    };
}

// Expose globally for console access
window.runRestartTest = restartStressTest;

console.log('🧪 Restart Stress Test loaded!');
console.log('📝 To run: runRestartTest()');
