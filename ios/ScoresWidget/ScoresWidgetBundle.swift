//
//  ScoresWidgetBundle.swift
//  ScoresWidget
//
//  Created by Saul Sharma on 1/18/25.
//

import WidgetKit
import SwiftUI

@main
struct ScoresWidgetBundle: WidgetBundle {
    var body: some Widget {
        ScoresWidget()
        ScoresWidgetLiveActivity()
    }
}
