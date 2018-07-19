// tslint:disable:max-classes-per-file


/// <summary>
/// Interface für die temp. Suspendierung von Aktivitäten (Updates, Redraw, etc.).
/// Eine Klasse, die suspendierbar ist implementiert dieses Interface oder hat eine Property des
/// entsprechenden Typs (z.B. PaintingSuspendable); wird zusammen mit einer konkreten
/// <see cref="Suspender"/>-Instanz und dem using-Konstrukt verwendet.
///
/// </summary>
export interface ISuspendable {
  /// <summary>
  /// Liefert <c>true</c>, falls die Aktivität suspendiert ist.
  /// </summary>
  /// <value>
  /// 	<c>true</c>, falls diese Instanz is suspended; sonst <c>false</c>.
  /// </value>
  isSuspended: boolean;

  /// <summary>
  /// Liefert <c>true</c>, falls die Aktivität wieder aufgenommen werden kann.
  /// </summary>
  /// <value>
  /// 	<c>true</c>, falls diese Instanz can be resumed; sonst <c>false</c>.
  /// </value>
  canBeResumed: boolean;

  /// <summary>
  /// Suspendiert die Aktivität.
  /// </summary>
  suspend(): void;


  /// <summary>
  /// Nimmt die Aktivität wieder auf.
  /// </summary>
  resume(): void;
}